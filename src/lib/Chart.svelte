<script>
    import { onMount, onDestroy } from "svelte";
    import { thresholdTemperature } from "../store";
    import Dygraph from "dygraphs";

    let threshold = $thresholdTemperature;
    // console.log("Updated Threshold:", $thresholdTemperature);
    let graphContainer;
    let g;
    let data = [[new Date(), 0]];
    let exceededData = [];
    let socket;

    function setUpWebSocket() {
        socket = new WebSocket("http://localhost:3001"); // Connect to server on port 3001
        socket.onopen = () => {
            console.log("Client connected to Server!");
        };
    }

    function generateRandomTemp() {
        return Math.random() * 50; // Simulating temperature maximum of 50°C
    }

    function updateGraph() {
        const now = new Date();
        const temp = generateRandomTemp();

        if (threshold !== $thresholdTemperature) {
            threshold = $thresholdTemperature;
            exceededData = [];
        }

        if (data.length >= 40) {
            data.shift(); // Remove the oldest entry to keep the graph clean
        }

        if (temp > threshold) {
            exceededThreshold({ now, temp });
        }

        data.push([now, temp]);

        if (g) {
            g.updateOptions({
                file: data,
            });
        }
    }

    setUpWebSocket();

    function exceededThreshold({ now, temp }) {
        socket.send(JSON.stringify({ now, temp }));
        exceededData.push({ temp, time: now })
        exceededData = [...exceededData];
        console.log(
            "The threshold is exceeded with tempreture: " + temp + " at " + now,
        );
    }

    onMount(() => {
        // Initialize Dygraph
        g = new Dygraph(graphContainer, data, {
            labels: ["Time", "Temperature (°C)"],
            ylabel: "Temperature (°C)",
            xlabel: "Time",
            drawPoints: true,
            // legend: "always",
            strokeWidth: 2,
            animatedZooms: true,
            axisLabelFontSize: 14,
            axisLabelColor: "blue",
            valueRange: [0, 50],
            drawGrid: false,
        });

        // Update graph every second
        const interval = setInterval(updateGraph, 1000);

        onDestroy(() => {
            clearInterval(interval);
        });
    });
</script>

<main class="chartContainer">
    <div class="chartTitle">Current Threshold is: {threshold}</div>
    <div bind:this={graphContainer} class="customDyagrph"></div>
    <ul class="exceededTemperatureList">            
        {#each exceededData as element}
            <li class="element">
                {`The temprature of: ${element.temp} is exceeded at: ${element.time}`}
            </li>
        {/each}
    </ul>
</main>

<style>
    .exceededTemperatureList{
        width: 60%;
        margin: 0 auto;
    }
    .exceededTemperatureList li{
        font-size: .9rem;
        margin: 10px 0 0;
    }
</style>