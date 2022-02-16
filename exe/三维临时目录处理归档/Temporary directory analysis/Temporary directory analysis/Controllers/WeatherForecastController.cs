using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Temporary_directory_analysis.Project;

namespace Temporary_directory_analysis.Controllers
{

   
    [ApiController]
    [Route("Dimensional")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        
        [HttpGet]
        [Route("GetBuildingStructure")]//camera
        public Object Get()
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
           


            string json;
            switch (configuration[$"System"])
            {
                case "Linux":
                    json = Linux_Gis.Getjson(Path);
                    // to stop it
                    Linux_ImWebServer.stop();
                    // to start it
                    Linux_ImWebServer.start(IPAddress.Parse(new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build()[$"Ip"]), 9731, 1, Path);

                    break;
                case "Windows":
                    json = Windows_Gis.Getjson(Path);
                    // to stop it
                    Windows_ImWebServer.stop();
                    // to start it
                    Windows_ImWebServer.start(IPAddress.Parse(new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build()[$"Ip"]), 9731, 1, Path);
                    break;
                default:
                    json = JsonConvert.SerializeObject(new
                    {
                        datas = ""
                    });
                    break;
            }
           
            return JsonConvert.DeserializeObject<JObject>(json);
        }
      
    }
}
