// تابع برای نمایش ورودی دستی یا انتخاب از لیست کشویی
function toggleManualInput(selectElement, manualInputDiv, inputId) {
  if (selectElement.value === "manual") {
    manualInputDiv.style.display = "block";
  } else {
    manualInputDiv.style.display = "none";
    document.getElementById(inputId).value = "";
  }
}

// اضافه کردن EventListener برای نمایش ورودی دستی
document.getElementById("conductivity").addEventListener("change", function () {
  toggleManualInput(
    this,
    document.getElementById("manualConductivity"),
    "manualConductivityInput"
  );
});
document.getElementById("voltageDrop").addEventListener("change", function () {
  toggleManualInput(
    this,
    document.getElementById("manualVoltageDrop"),
    "manualVoltageDropInput"
  );
});

// گرفتن مقادیر از ورودی‌ها
function getInputValues() {
  const voltage = parseFloat(document.getElementById("voltage").value);
  const conductivity =
    document.getElementById("conductivity").value === "manual"
      ? parseFloat(document.getElementById("manualConductivityInput").value)
      : parseFloat(document.getElementById("conductivity").value);
  const length = parseFloat(document.getElementById("length").value);
  const power = parseFloat(document.getElementById("power").value);
  const voltageDropPercentage =
    document.getElementById("voltageDrop").value === "manual"
      ? parseFloat(document.getElementById("manualVoltageDropInput").value)
      : parseFloat(document.getElementById("voltageDrop").value);
  const phases = parseInt(document.getElementById("phases").value);
  const powerFactor = parseFloat(document.getElementById("powerFactor").value);
  const efficiency = parseFloat(document.getElementById("efficiency").value);
  const powerUnit = parseFloat(document.getElementById("powerUnit").value);

  return {
    voltage,
    conductivity,
    length,
    voltageDropPercentage,
    phases,
    powerFactor,
    efficiency,
    powerUnit,
    power,
  };
}
// محاسبه جریان مصرفی

function calculateCurrent() {
  const { voltage, phases, powerFactor, efficiency, power } = getInputValues();

  let p = power;
  let pf = powerFactor;
  let q = efficiency;
  let v = voltage;
  let i;

  // تبدیل توان از اسب بخار به وات
  if (document.getElementById("powerUnit").value == "hp") {
    p = p * 736; // 1 hp = 736 W
  }
  if (phases == 1) {
    //   محاسبه جریان تک فاز
    i = p / (v * pf * q);
  } else {
    //   محاسبه جریان سه فاز
    i = p / (v * pf * q * Math.sqrt(3));
  }

  return i;
}

// محاسبه افت ولتاژ
function calculateVoltageDrop() {
  const {
    voltage,
    conductivity,
    length,
    voltageDropPercentage,
    phases,
    powerFactor,
  } = getInputValues();
  const i = calculateCurrent();
  let A;
  if (phases == 1) {
    // تک فاز
    A =
      (200 * length * i * powerFactor) /
      (conductivity * voltage * voltageDropPercentage);
  } else {
    // سه فاز
    A =
      (100 * Math.sqrt(3) * length * i * powerFactor) /
      (conductivity * voltageDropPercentage);
  }

  return A;
}

// محاسبه سطح مقطع کابل
function calculateCableCrossSection() {
  const { voltage, conductivity, length, voltageDropPercentage, phases } =
    getInputValues();
  const I = calculateCurrent();
  const voltageDrop = calculateVoltageDrop();
  let S;
  if (phases == 1) {
    S = (length * I * 200) / voltageDrop;
  } else {
    S = (length * I * 200) / (voltageDrop * Math.sqrt(3));
  }
  // فرمول سطح مقطع کابل
  return S;
}

// نمایش نتایج محاسبات
function displayResults() {
  let resultCalc = calculateCableCrossSection();
  if (!resultCalc) {
    console.log(3424);
  }
}

// اضافه کردن Event Listener به دکمه محاسبه
document
  .getElementById("calculateBtn")
  .addEventListener("click", function (event) {
    event.preventDefault(); // جلوگیری از ارسال فرم به طور پیش‌فرض
    // displayResults(); // نمایش نتایج
    displayResults();
  });
