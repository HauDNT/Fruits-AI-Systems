from typing import Dict

class ResultAnalyzer:
    def __init__(self, standard_threshold: float = 0.7):
        self.standard_threshold = standard_threshold
        
    def analyze_results(self, results: list[Dict]) -> Dict:
        result_1, result_2 = results
        
        if result_1['confidence'] >= self.standard_threshold and result_2['confidence'] >= self.standard_threshold:
            return result_1 if result_1['confidence'] >= result_2['confidence'] else result_2
        
        if result_1['confidence'] >= self.standard_threshold and result_2['confidence'] < self.standard_threshold:
            return result_1
        
        if result_2['confidence'] >= self.standard_threshold and result_1['confidence'] < self.standard_threshold:
            return result_2
        
        return result_1 if result_1['confidence'] >= result_2['confidence'] else result_2