import {
  Box,
  Button,
  Flex,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";
import WaveSurfer from "wavesurfer.js";

const AudioPlay = ({ audio }) => {
  const bg = useColorModeValue("brand.light", "gray.800");
  const [isPlaying, setIsPlaying] = useState(false);
  const { colorMode } = useColorMode();
  const wavesurferRef = useRef(null);
  const waveformRef = useRef(null);
  const waveColor =
    colorMode === "light" ? "#212F3C" : "rgba(255, 255, 255, 0.5)";

  useEffect(() => {
    const abortController = new AbortController();
    let isMounted = true;
    const initializeWaveSurfer = async () => {
      if (wavesurferRef.current) {
        await wavesurferRef.current.destroy()
      }
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: waveColor,
        progressColor: 'teal',
        cursorColor: "transparent",
        barWidth: 2,
        barRadius: 3,
        responsive: true,
        height: 50,
        barGap: 3,
      });

      ws.on('finish', () => {
        if (isMounted) {
          setIsPlaying(false);
        }
      });
      try {
        await ws.load(audio);
        if (isMounted) {
          wavesurferRef.current = ws;
        } else {
          ws.destroy();
        }
      } catch (error) {
        console.error('Error loading audio:', error);
        if (!isMounted) {
          ws.destroy();
        }
      }
    }


    initializeWaveSurfer();

    return () => {
      isMounted = false;
      abortController.abort();
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, [audio, waveColor]);
  const togglePlayPause = (e) => {
    e.stopPropagation()
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  return (
    <Box onClick={(e) => e.stopPropagation()} w={'100%'} bg={bg} p={4} borderRadius="md" borderWidth={'0.5px'} borderColor={!bg}>
      <Flex alignItems={"center"} gap={3}>
        <Button
          colorScheme={colorMode === "dark" ? "" : "teal"}
          onClick={togglePlayPause}
          variant={"outline"}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </Button>
        <Box ref={waveformRef} width="100%" mt={3}></Box>
      </Flex>
    </Box>
  );
};

export default AudioPlay;
