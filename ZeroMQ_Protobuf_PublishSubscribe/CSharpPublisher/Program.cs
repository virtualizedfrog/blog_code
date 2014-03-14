using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

using ZeroMQ;
using ProtoBuf;

namespace CSPublish
{
    class Program
    {
        static void Main(string[] args)
        {
            bool publish = true;
            Task.Run(async () =>
            {
                Random random = new Random();
                using (var context = ZmqContext.Create())
                {
                    using (var socket = context.CreateSocket(SocketType.PUB))
                    {
                        socket.Bind("tcp://127.0.0.1:5000");
                        using (var stream = new MemoryStream())
                        {
                            while (publish)
                            {
                                var data = new TimestampData
                                {
                                    Timestamp = DateTime.Now.Ticks,
                                    Key = "SYM",
                                    Data = random.NextDouble()
                                };

                                Serializer.Serialize(stream, data);
                                byte[] bytes = stream.ToArray();
                                socket.Send(bytes);

                                stream.SetLength(0);
                                await Task.Delay(1);
                            }
                        }
                    }
                }
            });
            Console.ReadLine();
            publish = false;
        }
    }
}
