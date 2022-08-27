const mq = require('./controller/rabbitmq');


mq.consumer('my_exchange', 'events', 'test', (msg) => {
    
    console.log(`\n[X] Message receved: ${msg.content}`);

});