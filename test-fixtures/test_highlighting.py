#!/usr/bin/env python3
"""
Test file for Enhanced Python Syntax Highlighting
This file contains examples of all the patterns our extension should highlight.
"""

import numpy as np
import pandas as pd
from pandas import read_csv, isna as is_nan
from numpy import array, zeros
import matplotlib.pyplot as plt

# =============================================================================
# NAMING CONVENTION TESTS
# =============================================================================

# PascalCase identifiers (should be orange/bold)
MyClass = "PascalCase class name"
SomeVariable = "PascalCase variable"
AnotherIdentifier = "PascalCase identifier"
DataProcessor = "PascalCase class"
ValidationError = "PascalCase exception"

# camelCase identifiers (should be teal/green)
myVariable = "camelCase variable"
someFunction = "camelCase function name"
dataProcessor = "camelCase instance"
validationResult = "camelCase result"
errorMessage = "camelCase message"

# regular snake_case (should use default highlighting)
regular_variable = "normal snake_case"
another_function = "normal snake_case"

# =============================================================================
# NUMPY FUNCTION TESTS
# =============================================================================

# NumPy with alias (should be blue/italic for functions, light blue for module)
data = np.array([1, 2, 3, 4, 5])
zeros_array = np.zeros(10)
ones_matrix = np.ones((3, 3))
random_data = np.random.normal(0, 1, 100)
reshaped = np.reshape(data, (5, 1))
transposed = np.transpose(data)
mean_value = np.mean(data)
std_value = np.std(data)

# NumPy with full name
full_array = numpy.array([1, 2, 3])
full_zeros = numpy.zeros(5)

# Direct imports (should still be highlighted)
direct_array = array([1, 2, 3])
direct_zeros = zeros(10)

# =============================================================================
# PANDAS FUNCTION TESTS
# =============================================================================

# Pandas with alias (should be purple/italic for functions, light purple for module)
df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})
csv_data = pd.read_csv('data.csv')
merged_df = pd.merge(df, csv_data, on='key')
grouped = pd.groupby(df, 'A')
pivoted = pd.pivot_table(df, values='B', index='A')

# Pandas classes (should be bold purple)
series = pd.Series([1, 2, 3, 4, 5])
index = pd.Index(['a', 'b', 'c'])
timestamp = pd.Timestamp('2023-01-01')

# Pandas with full name
full_df = pandas.DataFrame({'C': [7, 8, 9]})
full_csv = pandas.read_csv('other.csv')

# Direct imports
direct_csv = read_csv('direct.csv')
null_check = is_nan(data)

# =============================================================================
# OTHER LIBRARY TESTS
# =============================================================================

# Matplotlib (should be yellow/italic for functions)
plt.figure(figsize=(10, 6))
plt.plot([1, 2, 3], [4, 5, 6])
plt.xlabel('X values')
plt.ylabel('Y values')
plt.show()

# =============================================================================
# MIXED EXAMPLES
# =============================================================================

class DataAnalyzer:  # PascalCase class name
    def __init__(self):
        self.dataFrame = pd.DataFrame()  # camelCase attribute, pandas function
        self.resultArray = np.array([])  # camelCase attribute, numpy function
        
    def processData(self, inputData):  # camelCase method, camelCase parameter
        """Process data using various libraries."""
        # Mix of naming conventions and library functions
        cleanedData = pd.dropna(inputData)  # camelCase, pandas function
        normalizedArray = np.normalize(cleanedData.values)  # camelCase, numpy function
        ResultObject = self.createResult(normalizedArray)  # PascalCase local variable
        
        return ResultObject
    
    def createResult(self, processedData):  # camelCase method, camelCase parameter
        """Create result object."""
        return {
            'meanValue': np.mean(processedData),  # camelCase key, numpy function
            'StandardDeviation': np.std(processedData),  # PascalCase key, numpy function
            'dataShape': processedData.shape  # camelCase key
        }

# Function with mixed patterns
def analyzeDataset(csvPath, outputPath):  # camelCase function, camelCase parameters
    """Analyze dataset with custom highlighting."""
    rawData = pd.read_csv(csvPath)  # camelCase, pandas function
    CleanedDataset = rawData.dropna()  # PascalCase, pandas method
    
    # NumPy operations
    numericData = np.array(CleanedDataset.select_dtypes(include=[np.number]))
    meanValues = np.mean(numericData, axis=0)  # camelCase, numpy function
    StandardDeviations = np.std(numericData, axis=0)  # PascalCase, numpy function
    
    # Create summary
    summaryDict = {  # camelCase
        'TotalRows': len(CleanedDataset),  # PascalCase key
        'numericColumns': numericData.shape[1],  # camelCase key
        'MeanValues': meanValues,  # PascalCase key
        'standardDeviations': StandardDeviations  # camelCase key, PascalCase value
    }
    
    return summaryDict

# Usage example
if __name__ == "__main__":
    analyzer = DataAnalyzer()  # PascalCase class
    testData = np.random.randn(100, 5)  # camelCase, numpy function
    results = analyzer.processData(testData)  # camelCase method call
    
    print(f"Analysis complete: {results}") 