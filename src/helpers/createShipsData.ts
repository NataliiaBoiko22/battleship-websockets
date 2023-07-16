export function createShipsData(shipsData: any, roomInstance: any): any {
    const result: any = [];
    const obj = {
      ownerId: shipsData.indexPlayer,
      ships: []
    };
  
    shipsData.ships.forEach((position: any) => {
      const shipPositions = [];
      if (position.direction === true) {
        for (let i = 0; i < position.length; i++) {
          const pos = {
            state: 'alive',
            x: position.position.x,
            y: position.position.y + i
          };
          shipPositions.push(pos);
        }
      } else if (position.direction === false) {
        for (let i = 0; i < position.length; i++) {
          const pos = {
            state: 'alive',
            x: position.position.x + i,
            y: position.position.y
          };
          shipPositions.push(pos);
        }
      }
      result.push(shipPositions);
    });
  
    obj.ships = result;

  roomInstance.setShipsData(shipsData.indexPlayer, result)
    return obj;
  }
  