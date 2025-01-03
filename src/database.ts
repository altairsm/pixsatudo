import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 109.199.106.99,
  database: 'pixsactudo',
  password: '7205dc44551d147753bb341d221cf35b',
  port: 5432,
});

export default pool;