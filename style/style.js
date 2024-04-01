import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  pointsText: {
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    margin: 20,
  },
  gameEngine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  startButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: 'black',
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  startButtonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 30,
  },
});