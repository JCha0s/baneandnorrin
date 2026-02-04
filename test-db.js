const mongoose = require('mongoose');

// We are putting the string directly here just to prove it works
const uri = "mongodb+srv://sahlahmed:JRprN7oZhyEz4s8N@baneandnorrin.ayowrds.mongodb.net/?retryWrites=true&w=majority&appName=BaneAndNorrin";

async function runTest() {
  try {
    console.log("⏳ Connecting directly to Bane & Norrin database...");
    await mongoose.connect(uri);
    console.log("✅ SUCCESS: The connection is working perfectly!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ STILL FAILING. Error details:");
    console.error(err.message);
  }
}

runTest();