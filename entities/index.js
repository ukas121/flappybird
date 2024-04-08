import Matter from "matter-js"
import Bird from "../components/Bird";
import Floor from "../components/Floor";
import Obstacle from "../components/Obstacle";
import Clouds from "../components/Clouds"

import { Dimensions } from 'react-native'
import { getPipeSizePosPair } from "../utils/random";

const windowHeight = Dimensions.get('window').height
const windowWidth = Dimensions.get('window').width


export default restart => {
    let engine = Matter.Engine.create({ enableSleeping: false })

    let world = engine.world

    world.gravity.y = 0.4;

    const pipeSizePosA = getPipeSizePosPair()
    const pipeSizePosB = getPipeSizePosPair(windowWidth * 0.9)
    return {
        physics: { engine, world },

            // Add Clouds component with a different position for parallax effect
             Clouds1: Clouds(world, 'Clouds1', { x: windowWidth / 4, y: windowHeight / 4 }, { height: 40, width: 80 }, 1),
              Clouds2: Clouds(world, 'Clouds2', { x: windowWidth / 2, y: windowHeight / 2 }, { height: 50, width: 100 }, 2),
           Clouds3: Clouds(world, 'Clouds3', { x: windowWidth * 0.75, y: windowHeight * 0.75 }, { height: 50, width: 120 }, 3),
                        

        Bird: Bird(world, 'green', { x: 50, y: 300 }, { height: 40, width: 40 }),
        


        ObstacleTop1: Obstacle(world, 'ObstacleTop1', 'yellow', pipeSizePosA.pipeTop.pos, pipeSizePosA.pipeTop.size),
        ObstacleBottom1: Obstacle(world, 'ObstacleBottom1', 'blue', pipeSizePosA.pipeBottom.pos, pipeSizePosA.pipeBottom.size),

        ObstacleTop2: Obstacle(world, 'ObstacleTop2', 'yellow', pipeSizePosB.pipeTop.pos, pipeSizePosB.pipeTop.size),
        ObstacleBottom2: Obstacle(world, 'ObstacleBottom2', 'blue', pipeSizePosB.pipeBottom.pos, pipeSizePosB.pipeBottom.size),

        Floor: Floor(world, 'green', { x: windowWidth / 2, y: windowHeight }, { height: 70, width: windowWidth }),


    }
}