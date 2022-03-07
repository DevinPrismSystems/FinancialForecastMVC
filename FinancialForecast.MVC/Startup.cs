using FinancialForecast.MVC.Data;
using FinancialForecast.MVC.Models;
//using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Owin;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static FinancialForecast.MVC.Models.Deposit;

namespace FinancialForecast.MVC
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
            
            services.AddDbContext<AppIdentityDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("DefaultConnection")));
            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddDbContext<FinancialForecastDBContext>(options =>
               options.UseSqlServer(
                   Configuration.GetConnectionString("DefaultConnection")));
            services.AddDatabaseDeveloperPageExceptionFilter();

            services.ConfigureApplicationCookie(options => { options.LoginPath = "/Account/Login"; options.SlidingExpiration = true; options.Cookie.HttpOnly = true;
                options.ExpireTimeSpan = TimeSpan.FromMinutes(45); options.ReturnUrlParameter = "/Forecast/Index"; });

            //services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
            //    .AddEntityFrameworkStores<FinancialForecastDBContext>();

            

            services.AddControllersWithViews().AddRazorRuntimeCompilation();
            services.AddIdentity<IdentityUser, IdentityRole>(options => {
                options.Password.RequiredLength = 1;
                options.Password.RequireUppercase = false;
                options.Password.RequireDigit = false;
                options.Password.RequireNonAlphanumeric = false;
            }).AddEntityFrameworkStores<AppIdentityDbContext>().AddDefaultTokenProviders();

            
            services.AddMvc().AddRazorPagesOptions(options =>
            {
                options.Conventions.AddPageRoute("/Deposit/Index", "");
            });
            
            //services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options => { options.LoginPath = "Account/Login"; options.LogoutPath = "Account/Logout"; });
            services.AddMvc(options =>
           {
               var policy = new AuthorizationPolicyBuilder().AddAuthenticationSchemes().RequireAuthenticatedUser().Build(); options.Filters.Add(new AuthorizeFilter(policy));
           }).AddXmlSerializerFormatters();

            services.AddControllers(option => option.EnableEndpointRouting = true).AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new DateTimeConverter());
            });

            //services.AddControllers()
            //.AddNewtonsoftJson(options =>
            //{
            //    options.SerializerSettings.DateFormatHandling = DateFormatHandling.MicrosoftDateFormat;
            //});
            //services.AddMvc(options => options.EnableEndpointRouting = false);
            services.AddOptions();

            services.AddTransient<UserManager<IdentityUser>>();
            services.AddTransient<AppIdentityDbContext>();
            services.AddScoped<UserManager<IdentityUser>>();

            services.AddHttpContextAccessor();
            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                app.UseMigrationsEndPoint();
            }
            else
            {
                app.UseExceptionHandler("/Error/Index");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();

            //FileServerOptions fileServerOptions = new FileServerOptions();
            //fileServerOptions.DefaultFilesOptions.DefaultFileNames.Clear();
            //fileServerOptions.DefaultFilesOptions.DefaultFileNames.Add("/Forecast/Index.cshtml");
            //app.UseFileServer(fileServerOptions);

            //app.UseFileServer();


            //Specify the MyCustomPage1.html as the default page
            DefaultFilesOptions defaultFilesOptions = new DefaultFilesOptions();
            defaultFilesOptions.DefaultFileNames.Clear();
            defaultFilesOptions.DefaultFileNames.Add("/Forecast/Index.cshtml");
            //Setting the Default Files
            app.UseDefaultFiles(defaultFilesOptions);
            app.UseDefaultFiles();

            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            CookiePolicyOptions cookiePolicyOptions = new CookiePolicyOptions { MinimumSameSitePolicy = Microsoft.AspNetCore.Http.SameSiteMode.Strict };

            app.UseCookiePolicy(cookiePolicyOptions);

            //app.UseMvc(routes =>
            //{
            //    routes.MapRoute("Default", "{Controller=Forecast}/{action=Index},{id?}");
            //});

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Forecast}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
                endpoints.MapControllerRoute(
                    name: "Login",
                    pattern: "{controller=Users}/{action=Login}");
            });

            app.Run(async (context) =>
            {
                await context.Response.WriteAsync("Request handled and response generated");
            });
        }
        //public void ConfigureAuth(IAppBuilder app)
        //{

        //    app.CreatePerOwinContext<UserManager>(UserManager.Create);
        //    app.CreatePerOwinContext<SignInManager>(SignInManager.Create);
        //}
    }
}
