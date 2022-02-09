using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace PlanningPoker.Hubs
{
    public class PokerHub : Hub
    {
        private static readonly Room Room = new Room();

        public async Task Enter(string user)
        {
            Room.SetPlayerName(Context.ConnectionId, user);
            await BroadcastGameState();
        }

        public override Task OnConnectedAsync()
        {
            Room.AddNewPlayer(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            Room.RemovePlayer(Context.ConnectionId);
            await base.OnDisconnectedAsync(exception);
            await BroadcastGameState();
        }

        public async Task SendCardSelection(string card)
        {
            Room.SetCardSelection(Context.ConnectionId, card);
            await BroadcastGameState();
        }

        //public async Task SendStatus(string user, bool isCardLocked)
        //{
        //    await Clients.All.SendAsync("ReceiveStatus", user, isCardLocked);
        //}

        //public async Task RevealCard(string user, string card)
        //{
        //    await Clients.All.SendAsync("ReceiveCard", user, card);
        //}

        public async Task StartRound(string[] cards)
        {
            Room.StartRound(Context.ConnectionId, cards);
            await BroadcastGameState();
        }

        public async Task EndRound()
        {
            Room.EndRound();
            await BroadcastGameState();
        }

        public async Task SendMessage(string user, string msg)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, msg);
        }

        public async Task BroadcastGameState()
        {
            await Clients.All.SendAsync("ReceiveGameState", Room);
        }
    }

    public class Room
    {
        public ConcurrentDictionary<string, Player> Players { get; set; } = new ConcurrentDictionary<string, Player>();
        public string[] Cards { get; set; }

        public bool IsRunning { get; set; }

        public string StartedBy { get; set; }

        public IList<ResultItem> LastResult { get; set; }


        public void AddNewPlayer(string id)
        {
            Players[id] = new Player
            {
                Id = id,
                Name = "Neuer Spieler"
            };
        }

        public void SetPlayerName(string id, string name)
        {
            if (!Players.ContainsKey(id)) return;
            Players[id].Name = name;
        }

        public void SetCardSelection(string id, string card)
        {
            if (!Players.ContainsKey(id)) return;
            Players[id].SelectedCard = card;
        }

        public void RemovePlayer(string id)
        {
            Players.TryRemove(id, out var player);
            if (!Players.Any())
            {
                EndRound();
            }
        }

        public void StartRound(string id, string[] cards)
        {
            if (!Players.ContainsKey(id)) return;

            Cards = cards;
            foreach (var player in Players) player.Value.SelectedCard = null;

            StartedBy = Players[id].Name;

            IsRunning = true;
        }

        public void EndRound()
        {
            LastResult = Players.GroupBy(x => x.Value.SelectedCard).OrderBy(x => x.Key).Select(x => new ResultItem(x.Key, x.Count()))
                .ToList();//.ToDictionary(pairs => pairs.Key, pairs => pairs.Count());

            IsRunning = false;
        }
    }

    public class ResultItem
    {
        public ResultItem(string card, int count)
        {
            Card = card;
            Count = count;
        }
        public string Card { get; set; }
        public int Count { get; set; }
    }

    public class Player
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string SelectedCard { get; set; }
    }
}