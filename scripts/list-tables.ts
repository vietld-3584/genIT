import { getORM } from '../lib/db/client';

async function listTables() {
  const orm = await getORM();
  
  try {
    const connection = orm.em.getConnection();
    const result = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📋 Database tables:');
    result.forEach((row: any) => {
      console.log(`  - ${row.table_name}`);
    });
    
    console.log(`\n📊 Total: ${result.length} tables`);
    
  } catch (error) {
    console.error('❌ Error listing tables:', error);
  } finally {
    await orm.close();
  }
}

listTables();
