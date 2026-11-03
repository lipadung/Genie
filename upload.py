import argparse
import logging
import math
import os
from pathlib import Path

import httpx
import serial
from dotenv import load_dotenv
from postgrest.exceptions import APIError
from supabase import Client, create_client

BAUD_RATE = 9600
DEFAULT_PORT = "/dev/cu.usbserial-210"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)
logger = logging.getLogger(__name__)


def create_supabase_client() -> Client:
    script_dir = Path(__file__).resolve().parent
    env_paths = (script_dir / ".env", script_dir.parent / ".env")
    env_path = next((path for path in env_paths if path.is_file()), None)
    if env_path is not None:
        load_dotenv(env_path)

    url = os.getenv("VITE_SUPABASE_URL")
    key = os.getenv("VITE_SUPABASE_ANON_KEY")
    missing = [
        name
        for name, value in (
            ("VITE_SUPABASE_URL", url),
            ("VITE_SUPABASE_ANON_KEY", key),
        )
        if not value
    ]
    if missing:
        raise RuntimeError(
            f"Missing required .env setting(s): {', '.join(missing)}"
        )

    return create_client(url, key)


def parse_value(line: bytes) -> float:
    text = line.decode("utf-8", errors="replace").strip()
    value = float(text)
    if not math.isfinite(value):
        raise ValueError("Serial value must be a finite number.")
    return value


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Upload numeric Arduino serial readings to Supabase."
    )
    parser.add_argument(
        "--port",
        default=DEFAULT_PORT,
        help=f"Arduino serial port (default: {DEFAULT_PORT})",
    )
    args = parser.parse_args()

    client = create_supabase_client()
    logger.info("Connecting to %s at %d baud.", args.port, BAUD_RATE)

    try:
        with serial.Serial(args.port, BAUD_RATE, timeout=1) as arduino:
            logger.info("Connected. Press Ctrl+C to stop.")
            while True:
                line = arduino.readline()
                if not line:
                    continue
                try:
                    value = parse_value(line)
                except ValueError:
                    logger.warning("Skipping a non-numeric serial line.")
                    continue

                print(f"{value:g}", flush=True)
                stored_value = int(value) if value.is_integer() else value
                try:
                    client.table("readings").insert(
                        {"value": stored_value}
                    ).execute()
                except APIError as error:
                    logger.error("Supabase rejected value %s: %s", value, error)
                except httpx.HTTPError as error:
                    logger.error(
                        "Supabase request failed for value %s: %s", value, error
                    )
                else:
                    logger.info("Uploaded value to Supabase: %s", value)
    except KeyboardInterrupt:
        logger.info("Stopped.")
    except serial.SerialException as error:
        logger.error("Serial connection failed: %s", error)
        raise


if __name__ == "__main__":
    main()
