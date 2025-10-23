export const validateBillInput = (formData, latestBillDate = null) => {
  const errors = {};

  // Check if date is provided and is a valid Date object
  if (!formData.date || !(formData.date instanceof Date) || isNaN(formData.date.getTime())) {
    errors.date = 'A valid date is required';
    return { isValid: false, errors };
  }

  // Create date objects for comparison (ignoring time)
  const inputDate = new Date(formData.date);
  inputDate.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if date is in the future
  if (inputDate > today) {
    errors.date = 'Date cannot be in the future';
    return { isValid: false, errors };
  }

  // Check if date is after the latest bill date
  if (latestBillDate) {
    // Parse the stored date string (could be in dd-MM-yyyy or yyyy-MM-dd format)
    let latestDate;
    if (latestBillDate.includes('-')) {
      const parts = latestBillDate.split('-');
      if (parts[0].length === 4) {
        // yyyy-MM-dd format
        latestDate = new Date(parts[0], parts[1] - 1, parts[2]);
      } else {
        // dd-MM-yyyy format
        latestDate = new Date(parts[2], parts[1] - 1, parts[0]);
      }
    } else {
      // Fallback to parsing as ISO string
      latestDate = new Date(latestBillDate);
    }
    
    latestDate.setHours(0, 0, 0, 0);
    
    if (inputDate <= latestDate) {
      const formattedLatestDate = latestDate.toLocaleDateString('en-GB'); // Shows as dd/mm/yyyy
      errors.date = `Date must be after the last bill date (${formattedLatestDate})`;
      return { isValid: false, errors };
    }
  }

  if (formData.totalUnits === '' || formData.totalUnits === null || formData.totalUnits === undefined) {
    errors.totalUnits = 'Total units is required';
  }

  if (formData.totalBillAmount === '' || formData.totalBillAmount === null || formData.totalBillAmount === undefined) {
    errors.totalBillAmount = 'Total bill amount is required';
  }

  if (formData.upperPrev === '' || formData.upperPrev === null || formData.upperPrev === undefined) {
    errors.upperPrev = 'Upper floor previous reading is required';
  }

  if (formData.upperCurr === '' || formData.upperCurr === null || formData.upperCurr === undefined) {
    errors.upperCurr = 'Upper floor current reading is required';
  }

  if (formData.rate === '' || formData.rate === null || formData.rate === undefined) {
    errors.rate = 'Per-unit rate is required';
  }

  // If any field is missing, return early
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  // Convert to numbers for validation
  const totalUnits = parseFloat(formData.totalUnits);
  const totalBillAmount = parseFloat(formData.totalBillAmount);
  const upperPrev = parseFloat(formData.upperPrev);
  const upperCurr = parseFloat(formData.upperCurr);
  const rate = parseFloat(formData.rate);

  // Validate numeric values
  if (isNaN(totalUnits) || totalUnits < 0) {
    errors.totalUnits = 'Total units must be a valid non-negative number';
  }

  if (isNaN(totalBillAmount) || totalBillAmount < 0) {
    errors.totalBillAmount = 'Total bill amount must be a valid non-negative number';
  }

  if (isNaN(upperPrev) || upperPrev < 0) {
    errors.upperPrev = 'Upper previous reading must be a valid non-negative number';
  }

  if (isNaN(upperCurr) || upperCurr < 0) {
    errors.upperCurr = 'Upper current reading must be a valid non-negative number';
  }

  if (isNaN(rate) || rate <= 0) {
    errors.rate = 'Per-unit rate must be a valid positive number';
  }

  // If numeric validation failed, return early
  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  // Validate upper current > upper previous
  if (upperCurr <= upperPrev) {
    errors.upperCurr = 'Upper current reading must be greater than previous reading';
    return { isValid: false, errors };
  }

  // Calculate upper units
  const upperUnits = upperCurr - upperPrev;

  // Validate upper units <= total units
  if (upperUnits > totalUnits) {
    errors.upperCurr = 'Upper floor consumption cannot exceed total consumption';
    return { isValid: false, errors };
  }

  // Calculate ground units and bill
  const groundUnits = totalUnits - upperUnits;
  const groundBill = parseFloat((groundUnits * rate).toFixed(2));

  return {
    isValid: true,
    errors: {},
    calculatedValues: {
      upperUnits,
      groundUnits,
      groundBill,
    },
  };
};

export const calculateBill = (formData, latestBillDate = null) => {
  const validation = validateBillInput(formData, latestBillDate);
  if (!validation.isValid) {
    throw new Error('Validation failed');
  }
  return validation.calculatedValues;
};
