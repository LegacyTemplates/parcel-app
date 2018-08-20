using System;
using System.Linq;
using ServiceStack;
using ServiceStack.Text;

namespace Server
{
    public class ServerPlugin : IPlugin
    {
        public void Register(IAppHost appHost)
        {
        }
    }
    
    //[Route("/hello/{Name}")] // Handled by /hello/_name.html API page, uncomment to take over
    public class Hello : IReturn<HelloResponse>
    {
        public string Name { get; set; }
    }

    public class HelloResponse
    {
        public string Result { get; set; }
    }

    public class MyServices : Service
    {
        public object Any(Hello request)
        {
            return new HelloResponse { Result = $"Hi {request.Name} from server.dll" };
        }
    }
}
