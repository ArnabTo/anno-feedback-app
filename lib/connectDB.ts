import mongoose from 'mongoose'
 
type ConnectionObject = {
    isConnected ? : number
 }

 const connection: ConnectionObject = {};

async function connectDB(): Promise<void>{
    if(connection.isConnected){
        console.log('Already connected to database');
        return
    }

    try{
        const db = await mongoose.connect(process.env.DB_URI || '',{})
      
        console.log(db)
        connection.isConnected = db.connections[0].readyState
        
        console.log('DB connected successfully')

    }catch( error ){
        console.log('Failed to connect with DB', error);
        process.exit(1)
    }
}
  