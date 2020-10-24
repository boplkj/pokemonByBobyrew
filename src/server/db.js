const {MongoClient} = require('mongodb')

const uri = 'mongodb+srv://boplkj:212121qwe@cluster0.vqcnr.mongodb.net/test'
const client = new MongoClient(uri)

export async function connectDb(){
  try {
    // Connect to the MongoDB cluster
    await client.connect();
    
  
  } catch (e) {
    console.error(e);
  } 
}

export function getClient() {
  return client
}