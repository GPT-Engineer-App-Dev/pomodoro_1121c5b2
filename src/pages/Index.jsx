import { useState, useEffect } from "react";
import { Box, Button, Text, VStack, Heading, Progress, useToast } from "@chakra-ui/react";
import { FaPlay, FaPause, FaSync } from "react-icons/fa";

const Index = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [mode, setMode] = useState("work"); // 'work' or 'break'
  const toast = useToast();

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft((seconds) => {
          if (seconds > 0) return seconds - 1;
          // Time is up
          setIsRunning(false);
          clearInterval(interval);
          switchMode();
          return 0;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const switchMode = () => {
    if (mode === "work") {
      setMode("break");
      setSecondsLeft(5 * 60); // 5 minutes break
      toast({
        title: "Time for a break!",
        description: "You've completed a Pomodoro, take a 5-minute break.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      setMode("work");
      setSecondsLeft(25 * 60); // 25 minutes work
      toast({
        title: "Back to work!",
        description: "Break's over, let's get back to work!",
        status: "info",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsLeft(mode === "work" ? 25 * 60 : 5 * 60);
  };

  const formatTime = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <VStack spacing={8} p={5}>
      <Heading>Pomodoro Timer</Heading>
      <Text fontSize="4xl">{formatTime()}</Text>
      <Progress value={((mode === "work" ? 25 * 60 - secondsLeft : 5 * 60 - secondsLeft) / (mode === "work" ? 25 * 60 : 5 * 60)) * 100} width="100%" size="lg" colorScheme={mode === "work" ? "red" : "green"} />
      <Box>
        <Button leftIcon={isRunning ? <FaPause /> : <FaPlay />} onClick={toggleTimer} colorScheme="teal" mr={3}>
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button leftIcon={<FaSync />} onClick={resetTimer} colorScheme="gray">
          Reset
        </Button>
      </Box>
    </VStack>
  );
};

export default Index;
