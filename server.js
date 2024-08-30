const express = require('express');
const dotenv=require('dotenv').config() 
const app=express()
const Redis = require('ioredis');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs'); // file system 

app.use(express.json()); 


// Redis client setup
const redis = new Redis();

// Rate limiting middleware , it gets excuted before after request but before respone 
const rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  keyGenerator: (req) => req.body.userId,
  handler: (req, res) => {
    const taskId = uuidv4();
    redis.rpush(`queue:${req.body.userId}`, taskId);
    res.status(429).json({ message: 'Rate limit exceeded. Task queued.', taskId });
  }
});


// Task processing route
app.post('/api/v1/task', rateLimiter, async (req, res) => {
  const { userId } = req.body;
  const taskId = uuidv4();
  
  try {
    await processTask(userId, taskId);
    res.json({ message:`${userId}-task completed at-${Date.now()}`, taskId });
  } catch (error) {
    res.status(500).json({ message: 'Error processing task', error: error.message });
  }
});


// Task processing function
async function processTask(userId, taskId) {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate task processing
  const timestamp = new Date().toISOString();
  const logMessage = `Task completed for user ${userId} at ${timestamp}\n`;
  
  fs.appendFile('task_log.txt', logMessage, (err) => {
    if (err) console.error('Error writing to log file:', err);
  });
  
  console.log(logMessage.trim());
}

// Queue processing
async function processQueue() {
  const userQueues = await redis.keys('queue:*');
  
  for (const queue of userQueues) {
    const userId = queue.split(':')[1];
    const taskId = await redis.lpop(queue);
    
    if (taskId) {
      await processTask(userId, taskId);
    }
  }
  
  setTimeout(processQueue, 1000); // Process queue every second
}

processQueue();




const port=process.env.PORT || 8000

app.listen(port, () => {
    console.log(`Worker ${process.pid} started on port ${port}`);
});