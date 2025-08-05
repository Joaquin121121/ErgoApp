# Utils Functions Documentation

This file contains utility functions used throughout the ErgoApp. Each function is designed to handle specific data transformations, calculations, and formatting operations.

## Date and Time Functions

- **formatDateString(date: Date)**: Formats a date to Spanish locale with weekday, day, and month. Handles Spanish character capitalization and removes commas from the output.

- **formatDateDDMMYYYY(date: Date)**: Formats a date as DD/MM or DD/MM/YYYY depending on whether it's the current year. Returns only day and month for current year dates.

- **getTimeString(date: Date)**: Extracts time from a date object in HH:MM format. Returns a string with padded zeros for single digits.

- **findMonday(date: Date)**: Finds the Monday of the week containing the given date. Returns a new Date object representing the Monday of that week.

- **createLocalDate(dateStr, timeStr?)**: Creates a date with correct local timezone to prevent timezone offset issues. Handles both date strings and Date objects with optional time strings.

- **createTimezoneIndependentDate(dateStr, timeStr?)**: Creates an ISO string that preserves the exact time specified by bypassing timezone issues. Builds the ISO string directly with explicit timezone offset.

- **isSameWeek(date1, date2)**: Compares two dates to determine if they fall within the same week using UTC calculations. Uses week number calculations to avoid timezone offset issues.

- **formatIsoToSpanishDate(isoDate)**: Converts ISO date format to Spanish DD/MM format. Extracts date parts and reverses them to match Spanish date convention.

- **spanishDateToIso(date)**: Converts Spanish DD/MM or DD/MM/YYYY format to ISO format. Uses current year if year is not provided in the input.

- **getFormattedDate(day, weekRange)**: Creates a formatted date string from a day name and week range. Translates day names to Spanish and formats the date with proper day/month display.

- **getCurrentDayName(date?)**: Returns the current day name as a DayName type. Maps JavaScript's getDay() to the application's DayName enum.

- **getCurrentWeekRange()**: Calculates the current week's date range from Monday to Sunday. Returns the range in DD/M/YYYY format.

## Text and Formatting Functions

- **camelToNatural(camelCase)**: Converts camelCase strings to natural language with proper capitalization. Handles Spanish characters and preserves acronyms while capitalizing the first letter of each word.

- **naturalToCamelCase(text)**: Converts natural language text to camelCase format. Removes special characters, normalizes spaces, and capitalizes words after the first.

- **formatMinutesToHoursAndMinutes(minutes)**: Converts minutes to a human-readable format showing hours and minutes. Returns "Xm" for under 60 minutes or "Xh Ym" for longer durations.

- **validateHHMM(value)**: Validates time strings in HH:MM format using regex pattern matching. Returns true for valid 24-hour time format strings.

## Data Processing Functions

- **getSecondsBetweenDates(date1, date2)**: Calculates the difference in seconds between two dates. Converts milliseconds to seconds for precise time calculations.

- **formatDate(dateString)**: Formats a date string to DD/MM/YYYY format. Extracts date components and pads them with leading zeros.

- **getPerformanceDrop(validPerformances)**: Calculates performance decline percentage using the highest and lowest performance values. Returns the percentage drop between average of highest two and lowest two values.

- **ftToCm(heightStr)**: Converts feet and inches to centimeters. Parses height string in format "X'Y" and calculates total centimeters.

- **ratioToPercentage(ratio)**: Converts a ratio string (e.g., "3/5") to a percentage value. Calculates the percentage by dividing first number by second number and multiplying by 100.

- **getPropertyValue(obj, key)**: Safely extracts property values from Athlete or Coach objects. Returns empty string if object is null or property doesn't exist.

- **getAge(birthDate)**: Calculates age from birth date with validation for invalid and future dates. Returns age in years or 0 for invalid inputs.

## Training Plan Functions

- **getReductionFromRangeEntries(type, rangeEntries)**: Converts range entries to volume or effort reduction objects. Maps range labels to percentage drop values for training calculations.

- **validateReps(input, seriesN)**: Validates repetition input formats for training exercises. Supports single numbers, ranges (5-8), and series (5/6/7) with proper validation rules.

- **initializeSelectedExerciseFromTrainingBlockData(exercise, trainingBlock)**: Creates a selected exercise object from training block data. Maps exercise properties to the selected exercise structure.

- **generateInitialProgression(nOfWeeks, seriesN, repetitions, effort)**: Generates progressive training data over multiple weeks. Increases effort by 5 each week and adjusts repetitions progressively.

- **formatProgression(progression)**: Formats progression data for display purposes. Converts progression objects to string-based display format.

- **initializeDisplayProgressionCollection(trainingBlock)**: Creates display progression collection from training block data. Maps each selected exercise to its formatted progression data.

- **initializeDisplayProgressionForSelectedExercise(selectedExercise)**: Formats progression data for a single selected exercise. Returns the progression array in display format.

- **getCurrentProgression(currentExercise)**: Finds the current or next progression step for an exercise. Returns the next uncompleted progression or the last completed one.

- **getExercisesArray(exercises)**: Flattens training blocks and selected exercises into a single array. Extracts exercises from training blocks and adds blockId references.

## Calendar and Session Functions

- **findOverlappingEvents(events, newEvent)**: Checks for time conflicts between events on the same day. Returns the ID of overlapping event or false if no conflict exists.

- **getCalendarDataFromTrainingPlan(trainingPlan, sessionPerformanceData)**: Generates calendar data from training plan and performance data. Calculates date ranges and populates sessions with performance information.

- **countTotalExercises(session)**: Counts total exercises in a training session including nested training blocks. Sums up all series from selected exercises and training blocks.

- **getCurrentDayName(date?)**: Returns the current day name as a DayName type. Maps JavaScript's getDay() to the application's DayName enum.

- **getCurrentWeekRange()**: Calculates the current week's date range from Monday to Sunday. Returns the range in DD/M/YYYY format.

## Test and Study Functions

- **getTestStatsSummary(completedStudies)**: Analyzes completed studies to generate test value history with comparisons. Groups tests by type, calculates current/past values, and includes RSI and ECR calculations.

- **getTestsForAthlete(completedStudies)**: Organizes completed studies by type and sorts them by proximity to current date. Returns grouped test data excluding Bosco tests with date-based sorting.

- **smoothenCurve(data)**: Interpolates data points to create smoother curves with at least 5 points. Adds intermediate values between existing points to improve visual representation.

## Utility Helper Functions

- **delay(ms)**: Creates a promise that resolves after specified milliseconds. Used for asynchronous operations and timing control.

- **spanishPositionalSuffixFactory(number, gender)**: Generates Spanish ordinal suffixes (1er, 2do, 3er, etc.) based on number and gender. Handles special cases for 1st, 2nd, 3rd and standard patterns for other numbers.

- **calculatePercentageDifference(value1, value2, options)**: Calculates percentage difference between two values with customizable formatting. Returns content, icon, and color based on positive/negative changes with configurable precision and thresholds.

## Performance and Validation Functions

- **getPerformanceDrop(validPerformances)**: Calculates performance decline using highest and lowest performance values. Returns percentage drop between average of top two and bottom two performances.

- **validateReps(input, seriesN)**: Validates repetition input formats for training exercises. Supports single numbers, ranges (5-8), and series (5/6/7) with proper validation rules.

- **validateHHMM(value)**: Validates time strings in HH:MM format using regex pattern matching. Returns true for valid 24-hour time format strings.

## Data Transformation Functions

- **getPropertyValue(obj, key)**: Safely extracts property values from Athlete or Coach objects. Returns empty string if object is null or property doesn't exist.

- **getAge(birthDate)**: Calculates age from birth date with validation for invalid and future dates. Returns age in years or 0 for invalid inputs.

- **ratioToPercentage(ratio)**: Converts a ratio string (e.g., "3/5") to a percentage value. Calculates the percentage by dividing first number by second number and multiplying by 100.

## Note

All functions are designed to be pure and handle edge cases gracefully. Error handling is implemented where necessary to prevent application crashes and provide meaningful fallback values.
