class Stopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.lapTimes = [];
        
        this.initializeElements();
        this.attachEventListeners();
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('time-display');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.lapBtn = document.getElementById('lap-btn');
        this.lapList = document.getElementById('lap-list');
    }
    
    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.addLap());
    }
    
    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateDisplay(), 10);
            this.isRunning = true;
            this.updateButtonStates();
        }
    }
    
    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            this.updateButtonStates();
        }
    }
    
    reset() {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.lapTimes = [];
        this.timeDisplay.textContent = '00:00:00';
        this.updateButtonStates();
        this.clearLapList();
    }
    
    addLap() {
        if (this.isRunning) {
            const currentTime = this.formatTime(this.elapsedTime);
            this.lapTimes.push({
                time: currentTime,
                totalTime: this.elapsedTime
            });
            this.displayLapTimes();
        }
    }
    
    updateDisplay() {
        this.elapsedTime = Date.now() - this.startTime;
        // Safety check to prevent negative or extremely large values
        if (this.elapsedTime < 0) {
            this.elapsedTime = 0;
        }
        this.timeDisplay.textContent = this.formatTime(this.elapsedTime);
    }
    
    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const centiseconds = Math.floor((milliseconds % 1000) / 10);
        
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${centiseconds.toString().padStart(2, '0')}`;
    }
    
    updateButtonStates() {
        if (this.isRunning) {
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.lapBtn.disabled = false;
        } else {
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.lapBtn.disabled = true;
        }
    }
    
    displayLapTimes() {
        if (this.lapTimes.length === 0) {
            this.lapList.innerHTML = '<p class="no-laps">No lap times recorded yet</p>';
            return;
        }
        
        this.lapList.innerHTML = '';
        
        this.lapTimes.forEach((lap, index) => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            const lapNumber = document.createElement('span');
            lapNumber.className = 'lap-number';
            lapNumber.textContent = `Lap ${index + 1}`;
            
            const lapTime = document.createElement('span');
            lapTime.textContent = lap.time;
            
            lapItem.appendChild(lapNumber);
            lapItem.appendChild(lapTime);
            this.lapList.appendChild(lapItem);
        });
        
        // Scroll to bottom to show latest lap
        this.lapList.scrollTop = this.lapList.scrollHeight;
    }
    
    clearLapList() {
        this.lapList.innerHTML = '<p class="no-laps">No lap times recorded yet</p>';
    }
}

// Initialize the stopwatch when the page loads
let stopwatchInstance;

document.addEventListener('DOMContentLoaded', () => {
    stopwatchInstance = new Stopwatch();
});

// Add keyboard shortcuts for better user experience
document.addEventListener('keydown', (event) => {
    if (!stopwatchInstance) return;
    
    switch(event.code) {
        case 'Space':
            event.preventDefault();
            if (stopwatchInstance.isRunning) {
                stopwatchInstance.pause();
            } else {
                stopwatchInstance.start();
            }
            break;
        case 'KeyR':
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                stopwatchInstance.reset();
            }
            break;
        case 'KeyL':
            if (stopwatchInstance.isRunning) {
                stopwatchInstance.addLap();
            }
            break;
    }
});
