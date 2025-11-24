import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

type TabType = 'battle' | 'inventory' | 'guilds' | 'dungeons' | 'trade';

interface Character {
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  exp: number;
  maxExp: number;
  gold: number;
  attack: number;
  defense: number;
}

interface Enemy {
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  level: number;
}

interface InventoryItem {
  id: number;
  name: string;
  type: 'weapon' | 'armor' | 'potion' | 'material';
  icon: string;
  equipped?: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('battle');
  const [character, setCharacter] = useState<Character>({
    name: 'Герой',
    level: 5,
    hp: 120,
    maxHp: 150,
    mana: 80,
    maxMana: 100,
    exp: 350,
    maxExp: 500,
    gold: 1250,
    attack: 45,
    defense: 30
  });

  const [enemy, setEnemy] = useState<Enemy>({
    name: 'Темный Волк',
    hp: 80,
    maxHp: 100,
    attack: 25,
    level: 4
  });

  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isAttacking, setIsAttacking] = useState(false);

  const [inventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Меч Героя', type: 'weapon', icon: 'Sword', equipped: true, rarity: 'epic' },
    { id: 2, name: 'Железная броня', type: 'armor', icon: 'Shield', equipped: true, rarity: 'rare' },
    { id: 3, name: 'Зелье здоровья', type: 'potion', icon: 'Heart', rarity: 'common' },
    { id: 4, name: 'Зелье маны', type: 'potion', icon: 'Sparkles', rarity: 'common' },
    { id: 5, name: 'Магический кристалл', type: 'material', icon: 'Gem', rarity: 'legendary' },
    { id: 6, name: 'Дерево', type: 'material', icon: 'TreePine', rarity: 'common' },
  ]);

  const attack = () => {
    if (isAttacking || enemy.hp <= 0) return;
    
    setIsAttacking(true);
    const damage = Math.floor(Math.random() * 20) + character.attack;
    const newEnemyHp = Math.max(0, enemy.hp - damage);
    
    setEnemy({ ...enemy, hp: newEnemyHp });
    setBattleLog(prev => [`Вы нанесли ${damage} урона!`, ...prev.slice(0, 4)]);

    setTimeout(() => {
      if (newEnemyHp > 0) {
        const enemyDamage = Math.floor(Math.random() * 10) + enemy.attack - character.defense;
        const actualDamage = Math.max(1, enemyDamage);
        setCharacter(prev => ({ ...prev, hp: Math.max(0, prev.hp - actualDamage) }));
        setBattleLog(prev => [`${enemy.name} нанёс ${actualDamage} урона!`, ...prev.slice(0, 4)]);
      } else {
        const expGain = 50;
        const goldGain = 100;
        setCharacter(prev => ({ 
          ...prev, 
          exp: prev.exp + expGain,
          gold: prev.gold + goldGain
        }));
        setBattleLog(prev => [`Победа! +${expGain} опыта, +${goldGain} золота`, ...prev.slice(0, 4)]);
      }
      setIsAttacking(false);
    }, 600);
  };

  const useSkill = (skillName: string, manaCost: number) => {
    if (isAttacking || character.mana < manaCost || enemy.hp <= 0) return;
    
    setIsAttacking(true);
    const damage = Math.floor(Math.random() * 30) + character.attack * 1.5;
    const newEnemyHp = Math.max(0, enemy.hp - damage);
    
    setCharacter(prev => ({ ...prev, mana: prev.mana - manaCost }));
    setEnemy({ ...enemy, hp: newEnemyHp });
    setBattleLog(prev => [`${skillName}: ${damage} урона!`, ...prev.slice(0, 4)]);

    setTimeout(() => {
      setIsAttacking(false);
    }, 600);
  };

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: 'bg-gray-500',
      rare: 'bg-blue-500',
      epic: 'bg-purple-500',
      legendary: 'bg-gold'
    };
    return colors[rarity as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <Card className="p-6 bg-card border-2 border-primary/30 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-primary">{character.name}</h1>
              <Badge className="mt-1">Уровень {character.level}</Badge>
            </div>
            <div className="flex items-center gap-2 text-gold">
              <Icon name="Coins" size={24} />
              <span className="text-xl font-bold">{character.gold}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm flex items-center gap-1">
                  <Icon name="Heart" size={16} className="text-hp" />
                  HP
                </span>
                <span className="text-sm">{character.hp}/{character.maxHp}</span>
              </div>
              <Progress value={(character.hp / character.maxHp) * 100} className="h-3 bg-muted">
                <div className="h-full bg-hp rounded-full transition-all" style={{ width: `${(character.hp / character.maxHp) * 100}%` }} />
              </Progress>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm flex items-center gap-1">
                  <Icon name="Sparkles" size={16} className="text-mana" />
                  Мана
                </span>
                <span className="text-sm">{character.mana}/{character.maxMana}</span>
              </div>
              <Progress value={(character.mana / character.maxMana) * 100} className="h-3 bg-muted">
                <div className="h-full bg-mana rounded-full transition-all" style={{ width: `${(character.mana / character.maxMana) * 100}%` }} />
              </Progress>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm flex items-center gap-1">
                  <Icon name="Star" size={16} className="text-primary" />
                  Опыт
                </span>
                <span className="text-sm">{character.exp}/{character.maxExp}</span>
              </div>
              <Progress value={(character.exp / character.maxExp) * 100} className="h-2 bg-muted">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(character.exp / character.maxExp) * 100}%` }} />
              </Progress>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <Card className="p-3 bg-muted/50 text-center">
              <Icon name="Sword" size={20} className="mx-auto mb-1 text-destructive" />
              <div className="text-xs text-muted-foreground">Атака</div>
              <div className="text-lg font-bold">{character.attack}</div>
            </Card>
            <Card className="p-3 bg-muted/50 text-center">
              <Icon name="Shield" size={20} className="mx-auto mb-1 text-mana" />
              <div className="text-xs text-muted-foreground">Защита</div>
              <div className="text-lg font-bold">{character.defense}</div>
            </Card>
          </div>
        </Card>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button 
            onClick={() => setActiveTab('battle')}
            variant={activeTab === 'battle' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Icon name="Swords" size={18} />
            Бой
          </Button>
          <Button 
            onClick={() => setActiveTab('inventory')}
            variant={activeTab === 'inventory' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Icon name="Package" size={18} />
            Инвентарь
          </Button>
          <Button 
            onClick={() => setActiveTab('guilds')}
            variant={activeTab === 'guilds' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Icon name="Users" size={18} />
            Гильдии
          </Button>
          <Button 
            onClick={() => setActiveTab('dungeons')}
            variant={activeTab === 'dungeons' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Icon name="Castle" size={18} />
            Подземелья
          </Button>
          <Button 
            onClick={() => setActiveTab('trade')}
            variant={activeTab === 'trade' ? 'default' : 'outline'}
            className="flex items-center gap-2"
          >
            <Icon name="ShoppingBag" size={18} />
            Торговля
          </Button>
        </div>

        {activeTab === 'battle' && (
          <Card className="p-6 bg-card border-2 border-destructive/30 animate-scale-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Swords" size={24} />
              Битва
            </h2>

            <Card className={`p-6 bg-destructive/10 mb-4 ${isAttacking && enemy.hp > 0 ? 'animate-shake' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{enemy.name}</h3>
                <Badge variant="destructive">Ур. {enemy.level}</Badge>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">HP</span>
                <span className="text-sm">{enemy.hp}/{enemy.maxHp}</span>
              </div>
              <Progress value={(enemy.hp / enemy.maxHp) * 100} className="h-4 bg-muted">
                <div className="h-full bg-hp rounded-full transition-all" style={{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }} />
              </Progress>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <Button 
                onClick={attack} 
                disabled={isAttacking || enemy.hp <= 0}
                className="flex items-center gap-2 animate-pulse-glow"
              >
                <Icon name="Sword" size={18} />
                Атака
              </Button>
              <Button 
                onClick={() => useSkill('Огненный шар', 20)}
                disabled={isAttacking || character.mana < 20 || enemy.hp <= 0}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Icon name="Flame" size={18} />
                Огненный шар (20)
              </Button>
              <Button 
                onClick={() => useSkill('Ледяной удар', 30)}
                disabled={isAttacking || character.mana < 30 || enemy.hp <= 0}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Icon name="Snowflake" size={18} />
                Ледяной удар (30)
              </Button>
            </div>

            <Card className="p-4 bg-muted/30">
              <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                <Icon name="Scroll" size={16} />
                Лог боя
              </h3>
              <div className="space-y-1 text-sm">
                {battleLog.length === 0 ? (
                  <p className="text-muted-foreground">Начните бой!</p>
                ) : (
                  battleLog.map((log, i) => (
                    <p key={i} className="text-foreground/80">{log}</p>
                  ))
                )}
              </div>
            </Card>
          </Card>
        )}

        {activeTab === 'inventory' && (
          <Card className="p-6 bg-card animate-scale-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Package" size={24} />
              Инвентарь
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {inventory.map(item => (
                <Card 
                  key={item.id} 
                  className={`p-4 bg-muted/50 hover:bg-muted cursor-pointer transition-all hover:scale-105 border-2 ${getRarityColor(item.rarity)} border-opacity-50 relative`}
                >
                  {item.equipped && (
                    <Badge className="absolute -top-2 -right-2 text-xs">Надето</Badge>
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <Icon name={item.icon} size={32} className="text-primary" />
                    <p className="text-xs text-center font-medium">{item.name}</p>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {activeTab === 'guilds' && (
          <Card className="p-6 bg-card animate-scale-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Users" size={24} />
              Гильдии
            </h2>
            <p className="text-muted-foreground">Раздел в разработке...</p>
          </Card>
        )}

        {activeTab === 'dungeons' && (
          <Card className="p-6 bg-card animate-scale-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="Castle" size={24} />
              Подземелья
            </h2>
            <p className="text-muted-foreground">Раздел в разработке...</p>
          </Card>
        )}

        {activeTab === 'trade' && (
          <Card className="p-6 bg-card animate-scale-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Icon name="ShoppingBag" size={18} />
              Торговля
            </h2>
            <p className="text-muted-foreground">Раздел в разработке...</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
