// 38553864

# Tower Defense

Definition from wikipedia: Tower defense (TD) is a subgenre of strategy games where the goal is to defend a player's territories or possessions by obstructing the enemy attackers or by stopping enemies from reaching the exits, usually achieved by placing defensive structures on or along their path of attack. This typically means building a variety of different structures that serve to automatically block, impede, attack or destroy enemies. Tower defense is seen as a subgenre of real-time strategy video games, due to its real-time origins, even though many modern tower defense games include aspects of turn-based strategy. Strategic choice and positioning of defensive elements is an essential strategy of the genre.

## Game Initialization

To start the game run `npm install` and then `npm run dev`.

You start with 100 coins and 5 lives.

Notes: In tsconfig.json you might need to add "types": ["node"] to be able to use NodeJS.

## Things to take into Account

Every time you get to 200 coins you will get a life but lose the money, is like you are buying the lives, you can't decide if you want to purcharse it or not.

You can press Next Wave so the next wave will come earlier.

Every level the monsters are faster and have more lives.

If you put a tower where one already exists it will change the tower for the new one, take into account that even if you put the same one you will lose money.

If a monster gets to the end of the path you will lose a life. If you lose all your lives you lose. But a new game will start.

You can update a tower cliking in the yellow button below each tower. Each one has four updates: 
1. Makes the range bigger.
2. Shoots faster.
3. More damage and if its an ice tower pauses the monsters for longer.
4. The same as 3 but more

To update a tower you have to pay 100, if it is a fire tower 125.

To create a tower you have to pay 40, if it is a fire tower 50.

Fire towers are more expensive because they make more damage.

Ice towers stop the monsters for some time.
