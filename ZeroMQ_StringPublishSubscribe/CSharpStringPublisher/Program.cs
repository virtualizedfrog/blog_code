using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Text;
using ZeroMQ;

namespace CSharpStringPublisher
{
    class Program
    {
        private static ZmqContext context_ = null;
        private static ZmqSocket socket_ = null;

        static void Main(string[] args)
        {
            context_ = ZmqContext.Create();
            socket_ = context_.CreateSocket(SocketType.PUB);
            socket_.Bind("tcp://127.0.0.1:5000");

            bool publish = true;
            Task.Run(() => {
                while (publish)
                {
                    string timestring = DateTime.Now.ToString("u");
                    Console.WriteLine("Sending '{0}' to subscribers", timestring);
                    socket_.Send(timestring, Encoding.Unicode);
                    Thread.Sleep(1000);
                }
            });
            Console.ReadLine();
            publish = false;
        }
    }
}
