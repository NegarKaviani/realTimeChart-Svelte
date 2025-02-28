<script>
    import { thresholdTemperature } from "../store";
    import { get } from "svelte/store";

    let newThreshold = get(thresholdTemperature);
    function UpdateThreshold(){
        thresholdTemperature.set(newThreshold)
        console.log("Threshold updated to:", newThreshold);
    }
</script>

<main class="inputContainer">
    <h1 class="chart-header">Real-Time Temperature Monitor</h1>

    <!-- Threshold input -->
    <label for="threshold">Set Threshold (°C):</label>
    <input
        id="threshold"
        type="number"
        step="0.1"
        min="0"
        bind:value={newThreshold}
    />
    <button on:click={UpdateThreshold}>Set new Threshold</button>
</main>

<style>
    .chart-header{
        color: #00698b,
    }
</style>