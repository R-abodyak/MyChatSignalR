using chat.Data;
using chat.Hubs;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

public class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                IConfiguration configuration = new ConfigurationBuilder()
                    .SetBasePath(Directory.GetCurrentDirectory())
                    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                    .Build();

                // Get connection string
                var connectionString = configuration.GetConnectionString("DefaultConnection");
                webBuilder.ConfigureServices(services =>
                {
                    services.AddSignalR();
                    services.AddDbContext<ChatContext>(options =>
                    {
                        options.UseSqlServer(connectionString: connectionString);
                    });
                    services.AddControllersWithViews();

                });

                webBuilder.Configure(app =>
                {
                    var env = app.ApplicationServices.GetRequiredService<IWebHostEnvironment>();

                    if (env.IsDevelopment())
                    {
                        app.UseDeveloperExceptionPage();
                    }
                    else
                    {
                        app.UseExceptionHandler("/Home/Error");
                        app.UseHsts();
                    }

                    app.UseHttpsRedirection();
                    app.UseStaticFiles();

                    app.UseRouting();

                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapControllerRoute(
                            name: "default",
                            pattern: "{controller=Home}/{action=Index}/{id?}");
                        endpoints.MapHub<ChatHub>("/ChatHub"); // Map the SignalR hub
                    });
                });
            });
}
