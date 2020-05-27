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
      for(x = hStart; x < hEnd; x+=hStep)
      {
        y = y > amplitude - vStep ? vStart : y + vStep;
        data[name].push({"x":x, "y":y});
      }
      break;
    case "Negsaw":
        y = amplitude + vStep;
        for(x = hStart; x < hEnd; x+=hStep)
        {
          y = y < vStart + vStep ? amplitude : y - vStep;
          data[name].push({"x":x, "y":y});
        }
        break;
    case "Triangle":
      let peaked = false;
      for(x = hStart; x < hEnd; x+=hStep)
      {
        if(peaked)
        {
          peaked = y > vStart + vStep;
          y-=vStep;
        }
        else
        {
          peaked = y > amplitude - 2*vStep;
          console.log(peaked);
          y+=vStep;
        }
        
        data[name].push({"x":x, "y":y});
      }
      break;
    case "Square":
      for(x = hStart; x < hEnd; x+=hStep)
      {
        data[name].push({"x":x, "y":y});
        y = y === vStart ? amplitude : vStart;
      }
      break;
    case "Sine":
      for(x = hStart; x < hEnd; x+=hStep)
      {
        y = amplitude*Math.sin(2*Math.PI*(1/(wavelength-1))*x).toFixed(2);
        data[name].push({"x":x, "y":y});
      }
      break;
  }
  
  return(JSON.stringify(data, null, 4));
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

  document.getElementById("ParsedTextArea").value = createWaveform(hStart, hEnd, vStart, amplitude, hStep, vStep, name, waveform, wavelength);
}