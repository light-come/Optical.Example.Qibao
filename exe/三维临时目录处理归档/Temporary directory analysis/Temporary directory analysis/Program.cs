using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Temporary_directory_analysis.Project;

namespace Temporary_directory_analysis
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = new ConfigurationBuilder()
          .SetBasePath(Directory.GetCurrentDirectory()) // <== compile failing here
          .AddJsonFile("appsettings.json");
            IConfiguration configuration = builder.Build();
            var Path = configuration[$"Path"];

            if (!Directory.Exists(Path))//如果不存
            {
                //在就创建file文件夹
                Directory.CreateDirectory(Path);
            }


            switch (new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build()[$"System"])
            {
                case "Linux":
                    Linux_ImWebServer.start(IPAddress.Parse(new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build()[$"Ip"]), 9731, 1, Path);
                    break;
                case "Windows":
                    Windows_ImWebServer.start(IPAddress.Parse(new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build()[$"Ip"]), 9731, 1, Path);
                    break;
                default:
                    break;
            }
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                    webBuilder.UseUrls("http://*:" + new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build()[$"Port"]);
                });
    }
}
