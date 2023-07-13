export function createShipsData(shipsData: any, roomInstance: any): any {
    const result: any = [];
    const obj = {
      ownerId: shipsData.indexPlayer,
      ships: []
    };
  
    // console.log('shipsData', shipsData);
    // console.log('shipsData.indexPlayer', shipsData.indexPlayer);
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
  // console.log('obj',obj);

  console.log("CREATESHIPS");
  result.forEach((ship: any) => {
    ship.forEach((position: any) => {
      console.dir(position);
    });
  });
  roomInstance.setShipsData(shipsData.indexPlayer, result)
  // roomInstance.setShipsData(obj);
    return obj;
  }
  