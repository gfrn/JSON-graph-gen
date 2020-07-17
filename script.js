function removeInvalid(element) {
    var parsedString = element.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
    element.value = element.value.charAt(0) === '-' ? '-' + parsedString : parsedString;
}

function createWaveform(hStart, hEnd, vStart, amplitude, hStep, vStep, name, waveform, wavelength) {
  let y = vStart; 
  let data = {}
  data[name] = [];

  switch (waveform)
  {
    case "Possaw":
      vStep = (amplitude-vStart) / wavelength;
      for(x = hStart; x < hEnd; x+=hStep)
      {
        y = y + vStep > amplitude ? vStart : y + vStep;
        data[name].push({"x":x, "y":y});
      }
      break;
    case "Negsaw":
        vStep = (amplitude-vStart) / wavelength;
        for(x = hStart; x < hEnd; x+=hStep)
        {
          y = y - vStep < vStart ? amplitude : y - vStep;
          data[name].push({"x":x, "y":y});
        }
        break;
    case "Triangle":
      vStep = ((amplitude-vStart) / (wavelength))*2;
      console.log(vStep);
      let peaked = false;
      for(x = hStart; x < hEnd; x+=hStep)
      {
        data[name].push({"x":x, "y":y});
        if(peaked)
        {
          peaked = y > vStart + vStep;
          y = !peaked ? vStart : y-vStep;
        }
        else
        {
          peaked = y + vStep > amplitude;
          y = peaked ? amplitude - vStep : y+vStep;
        }
        
        console.log(peaked);
        console.log(y);
      }
      break;
    case "Square":
      for(x = hStart; x < hEnd; x+=wavelength)
      {
        data[name].push({"x":x, "y":y});
        data[name].push({"x":x+hStep, "y":y == vStart ? amplitude : vStart});
      }
      break;
    case "Sine":
      for(x = hStart; x < hEnd; x+=hStep)
      {
        console.log(x);
        y = amplitude*Math.sin(2*Math.PI*(1/(wavelength))*x).toFixed(2);
        data[name].push({"x":x, "y":y});
      }
      break;
  }
  
  return data;
}

function createGraph() {
  let waveformObject = document.getElementById("waveform");
  let waveform = waveformObject.options[waveformObject.selectedIndex].value;

  let hStart = +document.getElementById("HRangeStart").value;
  let hEnd = +document.getElementById("HRangeEnd").value;

  let vStart = +document.getElementById("VRangeStart").value;
  let amplitude = +document.getElementById("Amplitude").value;
  let wavelength = +document.getElementById("Wavelength").value;

  let hStep = +document.getElementById("Step").value;
  let vStep = amplitude/wavelength;

  let name = document.getElementById("Name").value;

  let data = createWaveform(hStart, hEnd, vStart, amplitude, hStep, vStep, name, waveform, wavelength);

  document.getElementById("ParsedTextArea").value = JSON.stringify(data, null, 4);
  let canvas = document.getElementById('chart').getContext('2d');
  var ctx = canvas;
  $("canvas").css({"background-color": "white"});

  var chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data[name].map(({ x }) => x),
      datasets: [{
          label: name,
          data: data[name].map(({ y }) => y),
      }]
    },
    options: {
        scales: {
            xAxes: [{
              distribution: "linear",
              ticks: {
                source: "auto"
              }
            }],
            yAxes: [{
                ticks: {
                    autoSkip: true,
                    beginAtZero: true
                }
            }]
        }
    }
  });

}