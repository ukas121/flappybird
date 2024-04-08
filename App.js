import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, ImageBackground } from "react-native";
import { GameEngine } from "react-native-game-engine";
import entities from "./entities";
import Physics from "./physics";
import { Audio } from "expo-av";

export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [soundObject, setSoundObject] = useState(null);
  const [paused, setPaused] = useState(false); // State to manage pause/unpause

  useEffect(() => {
    setRunning(false);
    prepareSound();
  }, []);

  const prepareSound = async () => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(require("./assets/Sky.mp3"), {
        isLooping: true,
      });
      setSoundObject(soundObject);
    } catch (error) {
      console.log("Error loading sound: ", error);
    }
  };

  const playSound = async () => {
    try {
      await soundObject.playAsync();
    } catch (error) {
      console.log("Error playing sound: ", error);
    }
  };

  const stopSound = async () => {
    try {
      await soundObject.stopAsync();
    } catch (error) {
      console.log("Error stopping sound: ", error);
    }
  };

  useEffect(() => {
    return () => {
      if (soundObject !== null) {
        soundObject.unloadAsync();
      }
    };
  }, [soundObject]);

  const handlePause = () => {
    setRunning(false);
    gameEngine && gameEngine.stop();
    stopSound();
    setPaused(true); // Set paused state to true when paused
  };

  const handleResume = () => {
    setRunning(true); // Set running state back to true to resume the game
    setPaused(false); // Set paused state back to false
    playSound(); // Resume playing sound
  };

  return (
    <ImageBackground
      source={require("./assets/night44.png")}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <StatusBar style="auto" hidden={true} />
        {running ? null : ( // Render "Game Over" text when the game ends
          <Text
            style={{
              textAlign: "center",
              fontSize: 40,
              fontWeight: "bold",
              margin: 20,
              color: "white",
            }}
          >
            Game Over!
          </Text>
        )}
        <Text
          style={{
            textAlign: "center",
            fontSize: 40,
            fontWeight: "bold",
            margin: 20,
            color: "white",
          }}
        >
          {currentPoints}
        </Text>
        <GameEngine
          ref={(ref) => {
            setGameEngine(ref);
          }}
          systems={[Physics]}
          entities={entities()}
          running={running}
          onEvent={(e) => {
            switch (e.type) {
              case "game_over":
                setRunning(false);
                gameEngine.stop();
                stopSound(); // Stop the sound when the game ends
                break;
              case "new_point":
                setCurrentPoints(currentPoints + 1);
                playSound(); // Play sound when a new point is earned
                break;
            }
          }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
        {!running && !paused ? ( // Render "Start Game" button when the game is not running and not paused
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                paddingHorizontal: 30,
                paddingVertical: 10,
              }}
              onPress={() => {
                setCurrentPoints(0);
                setRunning(true);
                gameEngine.swap(entities());
              }}
            >
              <Text
                style={{ fontWeight: "bold", color: "white", fontSize: 30 }}
              >
                START GAME
              </Text>
            </TouchableOpacity>
          </View>
        ) : !paused ? ( // Render pause button if game is not paused
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              backgroundColor: "black",
              padding: 10,
              borderRadius: 5,
            }}
            onPress={handlePause}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>PAUSE</Text>
          </TouchableOpacity>
        ) : (
          // Render unpause button if game is paused
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              backgroundColor: "black",
              padding: 10,
              borderRadius: 5,
            }}
            onPress={handleResume}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>RESUME</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
}
