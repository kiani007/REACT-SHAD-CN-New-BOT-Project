import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Shield, Swords, Heart, Eye, Trash2 } from 'lucide-react';

interface Bot {
  id: number;
  name: string;
  color: string;
  category: string;
  power: number;
  createdAt: string;
  updatedAt: string;
  avatar: string;
}

function App() {
  const [bots, setBots] = useState<Bot[]>([]);
  const [filteredBots, setFilteredBots] = useState<Bot[]>([]);
  const [army, setArmy] = useState<Bot[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetch('/db.json')
      .then((response) => response.json())
      .then((data) => {
        setBots(data.bots);
        setFilteredBots(data.bots);
      });
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Defense':
        return <Shield className="w-5 h-5" />;
      case 'Attack':
        return <Swords className="w-5 h-5" />;
      case 'Support':
        return <Heart className="w-5 h-5" />;
      case 'Recon':
        return <Eye className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === 'all') {
      setFilteredBots(bots);
    } else {
      setFilteredBots(bots.filter((bot) => bot.category === value));
    }
  };

  const addToArmy = (bot: Bot) => {
    if (!army.find((b) => b.id === bot.id)) {
      setArmy([...army, bot]);
    }
  };

  const removeFromArmy = (botId: number) => {
    setArmy(army.filter((bot) => bot.id !== botId));
  };

  const deleteBot = (botId: number) => {
    setBots(bots.filter((bot) => bot.id !== botId));
    setFilteredBots(filteredBots.filter((bot) => bot.id !== botId));
    setArmy(army.filter((bot) => bot.id !== botId));
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-red-600">Bot Army Manager</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Bots</h2>
          <Select onValueChange={handleCategoryChange} defaultValue="all">
            <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Defense">Defense</SelectItem>
              <SelectItem value="Attack">Attack</SelectItem>
              <SelectItem value="Support">Support</SelectItem>
              <SelectItem value="Recon">Recon</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredBots.map((bot) => (
              <Card
                key={bot.id}
                className="bg-gray-800 border-gray-700 hover:border-red-600 transition-all cursor-pointer"
                onClick={() => addToArmy(bot)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                    <img
                      src={bot.avatar}
                      alt={bot.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{bot.name}</h3>
                      {getCategoryIcon(bot.category)}
                    </div>
                    <p className="text-gray-400">Category: {bot.category}</p>
                    <p className="text-gray-400">Power: {bot.power}</p>
                    <p className="text-gray-400 text-sm">
                      Created: {format(new Date(bot.createdAt), 'PP')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Your Bot Army</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {army.map((bot) => (
              <Card
                key={bot.id}
                className="bg-gray-800 border-gray-700 relative group"
              >
                <CardContent className="p-4">
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                    <img
                      src={bot.avatar}
                      alt={bot.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{bot.name}</h3>
                      {getCategoryIcon(bot.category)}
                    </div>
                    <p className="text-gray-400">Category: {bot.category}</p>
                    <p className="text-gray-400">Power: {bot.power}</p>
                    <p className="text-gray-400 text-sm">
                      Updated: {format(new Date(bot.updatedAt), 'PP')}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-4">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => deleteBot(bot.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminate Bot
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;