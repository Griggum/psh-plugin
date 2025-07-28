#!/usr/bin/env python3
"""
🧠 Semantic Token Provider Test File
This file demonstrates the advanced import analysis and dynamic highlighting capabilities.
"""

# =============================================================================
# COMPLEX IMPORT SCENARIOS - Test Custom Aliases
# =============================================================================

# Standard aliases
import numpy as np
import pandas as pd

# Custom aliases (should be detected dynamically!)
import numpy as npy
import pandas as dataframes  
import matplotlib.pyplot as plotting

# Unusual aliases
import tensorflow as brain
import sklearn as ml
import torch as fire

# =============================================================================
# DIRECT IMPORT TESTS
# =============================================================================

# Standard direct imports
from numpy import array, zeros, ones
from pandas import read_csv, DataFrame
from pandas import isna as is_nan, fillna as fill_missing

# Custom renamed imports
from tensorflow import constant as tf_const
from sklearn import metrics as performance
from torch import tensor as fire_tensor

# =============================================================================
# NAMING CONVENTION TESTS (Semantic + TextMate Fallback)
# =============================================================================

# PascalCase identifiers (should be orange/bold)
MyAdvancedModel = "PascalCase class"
DataPreprocessor = "PascalCase processor"
NeuralNetworkArchitecture = "PascalCase complex"

# camelCase identifiers (should be teal/green)
myCustomVariable = "camelCase variable"
dataProcessingPipeline = "camelCase pipeline"
modelTrainingParameters = "camelCase params"

# =============================================================================
# STANDARD ALIAS TESTING
# =============================================================================

print("🔵 NumPy Standard Alias Tests:")
data = np.array([1, 2, 3, 4, 5])                    # np (light blue) + array (blue)
zeros_matrix = np.zeros((3, 3))                      # np + zeros
random_data = np.random.normal(0, 1, 100)           # np + random.normal
reshaped = np.reshape(data, (5, 1))                  # np + reshape

print("🟣 Pandas Standard Alias Tests:")
df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]}) # pd (light purple) + DataFrame (bold purple)
csv_data = pd.read_csv('data.csv')                   # pd + read_csv (purple italic)
merged = pd.merge(df, csv_data, on='key')            # pd + merge

# =============================================================================
# CUSTOM ALIAS TESTING - The Real Challenge!
# =============================================================================

print("🧠 Custom NumPy Alias Tests (npy):")
custom_array = npy.array([1, 2, 3])                 # npy should be light blue, array blue!
custom_zeros = npy.zeros(10)                        # npy + zeros
custom_random = npy.random.uniform(0, 1, 50)        # npy + random.uniform

print("🧠 Custom Pandas Alias Tests (dataframes):")
custom_df = dataframes.DataFrame({'X': [1, 2]})     # dataframes should be light purple, DataFrame bold purple!
custom_csv = dataframes.read_csv('file.csv')        # dataframes + read_csv
custom_series = dataframes.Series([1, 2, 3])        # dataframes + Series

print("🧠 Unusual Library Aliases:")
tensor_data = brain.constant([1, 2, 3])             # brain (tensorflow) should get library colors
model_score = ml.accuracy_score(y_true, y_pred)     # ml (sklearn) should get library colors
fire_data = fire.tensor([1, 2, 3])                  # fire (torch) should get library colors

# =============================================================================
# DIRECT IMPORT TESTING
# =============================================================================

print("📥 Direct Import Tests:")
direct_array = array([1, 2, 3])                     # Should be blue (numpy function)
direct_zeros = zeros(5)                             # Should be blue (numpy function)
direct_df = DataFrame({'A': [1, 2]})                # Should be bold purple (pandas class)
direct_csv = read_csv('test.csv')                   # Should be purple (pandas function)

print("📥 Renamed Direct Import Tests:")
missing_check = is_nan(data)                        # Should be purple (pandas alias)
filled_data = fill_missing(data, 0)                 # Should be purple (pandas alias)
tf_tensor = tf_const([1, 2, 3])                     # Should be library color (tensorflow alias)
accuracy = performance.accuracy_score(y1, y2)      # Should be library color (sklearn alias)
fire_tensor_data = fire_tensor([1, 2, 3])          # Should be library color (torch alias)

# =============================================================================
# NESTED MODULE CALLS
# =============================================================================

print("🔗 Nested Module Calls:")
norm_data = np.random.normal(0, 1, 100)             # np.random.normal - all parts highlighted
rand_data = npy.random.random(50)                   # npy.random.random - custom alias
plot_data = plotting.plot([1, 2, 3], [4, 5, 6])    # plotting.plot - matplotlib alias

# =============================================================================
# MIXED COMPLEX SCENARIOS
# =============================================================================

class AdvancedDataProcessor:                         # PascalCase class name
    def __init__(self):
        self.numpyData = npy.array([])               # camelCase + custom numpy alias
        self.pandasFrame = dataframes.DataFrame()    # camelCase + custom pandas alias
        self.TensorFlowModel = brain.Variable(0)     # PascalCase + tensorflow alias
        
    def processCustomData(self, inputData):          # camelCase method + camelCase param
        """Process data using custom library aliases."""
        cleanedData = dataframes.dropna(inputData)   # camelCase + custom pandas alias
        normalizedArray = npy.normalize(cleanedData.values)  # camelCase + custom numpy
        ModelResult = self.trainModel(normalizedArray)      # PascalCase + camelCase
        
        return ModelResult
    
    def trainModel(self, trainingData):              # camelCase method + camelCase param
        """Train model with custom aliases."""
        return {
            'meanValue': npy.mean(trainingData),     # camelCase + custom numpy
            'DataFrameSize': dataframes.DataFrame(trainingData).shape,  # PascalCase + custom pandas
            'tensorData': fire.tensor(trainingData) # camelCase + torch alias
        }

# =============================================================================
# USAGE DEMONSTRATION
# =============================================================================

if __name__ == "__main__":
    processor = AdvancedDataProcessor()             # PascalCase class
    testData = npy.random.randn(100, 5)            # camelCase + custom numpy alias
    results = processor.processCustomData(testData) # camelCase method
    
    print(f"🎉 Advanced Semantic Analysis Complete!")
    print(f"Detected aliases should be visible in highlighting.")
    print(f"Run 'Show Discovered Import Mappings' to see all detected aliases!") 