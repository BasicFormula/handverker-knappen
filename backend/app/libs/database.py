import os
import asyncpg

async def get_db_connection():
    return await asyncpg.connect(os.environ["DATABASE_URL"])

async def release_db_connection(conn):
    if conn:
        await conn.close()
