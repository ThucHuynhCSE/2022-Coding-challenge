const amqplib = require('amqplib');
const amqpUrl = `amqp://host.docker.internal:5672`;
const {resolve, officers,incidents} = require('./incident')


const MQSubChannel = async (option) => {
    const connection = await amqplib.connect(amqpUrl, 'heartbeat=60');
    const channel = await connection.createChannel();
    channel.prefetch(option.prefetch || 10);

    process.once('SIGINT', async () => {
        console.log('got sigint, closing connection');
        await channel.close();
        await connection.close();
        process.exit(0);
    });

    await channel.assertQueue(option.queue, { durable: false });
    return channel;
};
const main = async ()=>{
    const SubChannel = await MQSubChannel({
        prefetch:1,
        queue: "events"
    });
    
    process.once('SIGINT', async () => {
        console.log('got sigint, closing connection');
        await SubChannel.close();
        await connection.close();
        process.exit(0);
    });
    await SubChannel.consume(
       'events', 
        async (msg) => {
            const decodeMsg = JSON.parse(msg.content.toString());
            resolve(decodeMsg);
            SubChannel.ack(msg);
        },
        {
            noAck: false,
            consumerTag: 'consumer',
        }
    );
}

main();