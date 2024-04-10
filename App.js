import React, { useState, useEffect } from "react";
import { Text, TouchableOpacity, View, ImageBackground, Alert, Switch } from "react-native";
import { StatusBar } from "expo-status-bar";
import { GameEngine } from "react-native-game-engine";
import entities from "./entities";
import Physics from "./physics";
import { Audio } from "expo-av";
import { BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from '@expo/vector-icons';
import styles from './styles/style'; // Import styles from styles.js


export default function App() {
  const [running, setRunning] = useState(false);
  const [gameEngine, setGameEngine] = useState(null);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [soundObject, setSoundObject] = useState(null);
  const [paused, setPaused] = useState(false); // State to manage pause/unpause
  const [musicMuted, setMusicMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setRunning(false);
    prepareSound();
    loadMusicMutedState();
  }, []);

  useEffect(() => {
    if (soundObject) {
      if (musicMuted) {
        soundObject.stopAsync();
      } else {
        playSound();
      }
    }
    saveMusicMutedState();
  }, [musicMuted]);

  useEffect(() => {
    return () => {
      if (soundObject !== null) {
        soundObject.unloadAsync();
      }
    };
  }, [soundObject]);

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

  const toggleMusic = () => {
    setMusicMuted(!musicMuted);
  };

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

  const handleExitGame = () => {
    Alert.alert(
      "Exit Game",
      "Are you sure you want to exit?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => BackHandler.exitApp() }, // Exit the app when "OK" is pressed
      ],
      { cancelable: false }
    );
  };

  const exitGame = () => {
    setRunning(false);
    gameEngine && gameEngine.stop();
    stopSound();
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const loadMusicMutedState = async () => {
    try {
      const mutedState = await AsyncStorage.getItem("musicMuted");
      if (mutedState !== null) {
        setMusicMuted(JSON.parse(mutedState));
      }
    } catch (error) {
      console.log("Error loading music muted state: ", error);
    }
  };

  const saveMusicMutedState = async () => {
    try {
      await AsyncStorage.setItem("musicMuted", JSON.stringify(musicMuted));
    } catch (error) {
      console.log("Error saving music muted state: ", error);
    }
  };

  return (
    <ImageBackground
      source={require("./assets/night45.png")}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <StatusBar style="auto" hidden={true} />
        {!running && currentPoints > 0 ? ( 
          <Text style={styles.modalTextone}>Game Over!</Text>
        ) : null}
        <Text style={styles.modalTextone}>{currentPoints}</Text>
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
              style={[styles.button, { marginBottom: 10 }]}
              onPress={() => {
                setCurrentPoints(0);
                setRunning(true);
                gameEngine.swap(entities());
                if (!musicMuted) {
                  playSound();
                }
              }}
            >
              <Text style={styles.buttonText}>START GAME</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={toggleSettings}
            >
              <Text style={styles.buttonText}>SETTINGS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleExitGame}
            >
              <Text style={styles.buttonText}>EXIT GAME</Text>
            </TouchableOpacity>
          </View>
        ) : !paused ? ( // Render pause button if game is not paused
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={handlePause}
            >
              <FontAwesome6 name="pause" size={20} color="white" />
            </TouchableOpacity>
        ) : (
          // Render unpause button if game is paused
            <TouchableOpacity
              style={styles.pauseButton}
              onPress={handleResume}
            >
              <FontAwesome6 name="play" size={20} color="white" />
            </TouchableOpacity>
        )}

        {showSettings && (
          <View
            style={[styles.centeredView, { backgroundColor: "rgba(0, 0, 0, 0)" }]}
          >
            <View
              style={[styles.modalView, { backgroundColor: "black" }]}
            >
              <TouchableOpacity
                onPress={toggleMusic}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text style={[styles.modalText, { color: "white" }]}>
                  Mute Music
                </Text>
                <Switch value={musicMuted} onValueChange={toggleMusic} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleSettings}
                style={{ marginTop: 20 }}
              >
                <Text style={{ fontSize: 18, color: "blue" }}>
                  Close Settings
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}
