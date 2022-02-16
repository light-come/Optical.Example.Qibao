using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Temporary_directory_analysis
{

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();

            //注册Swagger生成器，定义一个和多个Swagger 文档
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v3", new OpenApiInfo { Title = "中间件服务可视化文档", Version = "v3" });
                //Determine base path for the application.  
                var basePath = Path.GetDirectoryName(typeof(Program).Assembly.Location);
                //Set the comments path for the swagger json and ui.  
                var xmlPath = Path.Combine(basePath, "Temporary directory analysis.xml");
                c.IncludeXmlComments(xmlPath);
            });


            {
                #region 跨域
                //services.AddCors(options =>
                //{
                //    options.AddPolicy(AllowSpecificOrigin,
                //        builder =>
                //        {
                //            builder.AllowAnyMethod()
                //                .AllowAnyOrigin()
                //                .AllowAnyHeader();
                //        });
                //});
                //10.6.201.4:8082

                //services
                //.AddCors(builder =>
                //{
                //    builder.AddDefaultPolicy(configure =>
                //    {
                //        configure.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                //    });
                //});


                services.AddCors(options =>
                {
                    options.AddPolicy(AllowSpecificOrigin,

                        builder => builder.AllowAnyOrigin()

                        .WithMethods("GET", "POST", "HEAD", "PUT", "DELETE", "OPTIONS")

                        );

                });

                #endregion
                //配置返回Json
                services.AddControllersWithViews().AddNewtonsoftJson();
            }


        }
        private readonly string AllowSpecificOrigin = "AllowSpecificOrigin";
        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //启用中间件服务生成Swagger作为JSON终结点
            app.UseSwagger();
            //启用中间件服务对swagger-ui，指定Swagger JSON终结点
            app.UseSwaggerUI(c =>
            {//ISC_API/
                c.SwaggerEndpoint("/swagger/v3/swagger.json", "HGHT API");
            });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            //设置远程
            app.UseRouting();
            //CORS 中间件必须配置为在对 UseRouting 和 UseEndpoints的调用之间执行。 配置不正确将导致中间件停止正常运行。
            app.UseCors(AllowSpecificOrigin);
            app.UseEndpoints(endpoints => { endpoints.MapControllers(); });
        }
    }
}
