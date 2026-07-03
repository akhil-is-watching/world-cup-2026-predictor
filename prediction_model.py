import json
from dataclasses import dataclass
from datetime import datetime

@dataclass
class TeamData:
    name: str
    fifa_ranking: int
    confederation: str
    recent_form: float
    squad_strength: float
    experience: float

class WorldCupPredictor:
    def __init__(self):
        self.teams = self._load_team_data()
        
    def _load_team_data(self):
        return [
            TeamData('France', 4, 'UEFA', 0.95, 0.98, 0.95),
            TeamData('Argentina', 5, 'UEFA', 0.92, 0.96, 0.93),
            TeamData('Spain', 8, 'UEFA', 0.90, 0.94, 0.92),
            TeamData('England', 6, 'UEFA', 0.88, 0.92, 0.85),
            TeamData('Brazil', 1, 'CONMEBOL', 0.91, 0.95, 0.88),
            TeamData('Germany', 16, 'UEFA', 0.85, 0.90, 0.90),
            TeamData('Netherlands', 8, 'UEFA', 0.84, 0.89, 0.87),
            TeamData('Belgium', 20, 'UEFA', 0.80, 0.84, 0.82),
            TeamData('Portugal', 12, 'UEFA', 0.82, 0.86, 0.88),
            TeamData('Italy', 36, 'UEFA', 0.75, 0.80, 0.85),
        ]
    
    def calculate_win_probability(self, team):
        ranking_score = (100 - min(team.fifa_ranking, 150)) / 150
        confederation_bonus = {'UEFA': 0.05, 'CONMEBOL': 0.04}.get(team.confederation, 0.01)
        
        win_prob = (
            ranking_score * 0.35 +
            team.recent_form * 0.25 +
            team.squad_strength * 0.20 +
            team.experience * 0.15 +
            confederation_bonus
        )
        return max(win_prob, 0.001)
    
    def get_predictions(self):
        predictions = {}
        total_prob = 0
        
        for team in self.teams:
            prob = self.calculate_win_probability(team)
            predictions[team.name] = {"probability_raw": prob}
            total_prob += prob
        
        for team_name in predictions:
            normalized = (predictions[team_name]['probability_raw'] / total_prob) * 100
            predictions[team_name]['win_probability'] = round(normalized, 2)
            del predictions[team_name]['probability_raw']
        
        return dict(sorted(predictions.items(), key=lambda x: x[1]['win_probability'], reverse=True))

if __name__ == '__main__':
    predictor = WorldCupPredictor()
    predictions = predictor.get_predictions()
    
    report = {
        'generated_at': datetime.now().isoformat(),
        'tournament': 'FIFA World Cup 2026',
        'top_predictions': list(predictions.items())[:10]
    }
    
    with open('predictions.json', 'w') as f:
        json.dump(report, f, indent=2)
