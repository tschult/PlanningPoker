using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace PlanningPoker.Hubs
{
    public class PokerHub: Hub
    {

        public async Task Enter(string user)
        {
            await Clients.All.SendAsync("ReceiveNewUser", user, Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.Others.SendAsync("ReceiveUserDisconnect", Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendStatus(string user, bool isCardLocked)
        {
            await Clients.All.SendAsync("ReceiveStatus", user, isCardLocked);
        }

        public async Task RevealCard(string user, string card)
        {
            await Clients.All.SendAsync("ReceiveCard", user, card);
        }

        public async Task StartRound(string user, string[] cards)
        {
            await Clients.All.SendAsync("ReceiveStart", user, cards);
        }

        public async Task EndRound(string user)
        {
            await Clients.All.SendAsync("ReceiveEnd", user);
        }
    }
}
