using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.AspNetCore.SignalR;
using System.Reflection;
using System.Security.Claims;
using System.Threading.Tasks;

namespace chat.Hubs
{
    public class ChatHub : Hub
    {


        public async Task SendMessage(string message, string sender, string receiverId)
        {

            await Clients.Client(receiverId).SendAsync("ReceiveMessage", message, sender);

        }


        public override async Task OnConnectedAsync()
        {
            var clientId = Context.ConnectionId; // Use the connection ID as a unique identifier
            await Clients.Client(clientId).SendAsync("connected", clientId);

            await base.OnConnectedAsync();
        }
    }
 }

