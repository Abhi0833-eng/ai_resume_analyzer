import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib
import json

# Training data - resume features and scores
data = {
    'years_experience': [0, 1, 2, 3, 5, 7, 10, 0, 1, 2, 3, 4, 6, 8, 0, 1, 2, 4, 5, 8],
    'num_skills': [3, 5, 7, 8, 10, 12, 15, 2, 4, 6, 9, 11, 13, 14, 1, 3, 5, 8, 10, 12],
    'has_projects': [1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
    'has_internship': [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1],
    'has_certifications': [0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
    'education_level': [1, 1, 2, 2, 2, 3, 3, 1, 1, 1, 2, 2, 2, 3, 1, 1, 2, 2, 2, 3],
    'num_achievements': [0, 1, 2, 3, 4, 5, 6, 0, 0, 1, 2, 3, 4, 5, 0, 0, 1, 2, 3, 4],
    'resume_score': [45, 55, 65, 70, 78, 85, 92, 30, 48, 58, 72, 76, 83, 88, 25, 40, 55, 68, 75, 87],
    'got_interview': [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1]
}

df = pd.DataFrame(data)

# Features for training
features = ['years_experience', 'num_skills', 'has_projects', 
            'has_internship', 'has_certifications', 'education_level', 
            'num_achievements']

X = df[features]

# Train Resume Score Predictor (Regression)
y_score = df['resume_score']
X_train, X_test, y_train, y_test = train_test_split(X, y_score, test_size=0.2, random_state=42)

score_model = GradientBoostingRegressor(n_estimators=100, random_state=42)
score_model.fit(X_train, y_train)

print(f"Score Model R2: {score_model.score(X_test, y_test):.2f}")

# Train Interview Predictor (Classification)
y_interview = df['got_interview']
X_train2, X_test2, y_train2, y_test2 = train_test_split(X, y_interview, test_size=0.2, random_state=42)

interview_model = RandomForestClassifier(n_estimators=100, random_state=42)
interview_model.fit(X_train2, y_train2)

y_pred = interview_model.predict(X_test2)
print(f"Interview Model Accuracy: {accuracy_score(y_test2, y_pred):.2f}")

# Save models
joblib.dump(score_model, 'score_model.pkl')
joblib.dump(interview_model, 'interview_model.pkl')

print("✅ Models saved successfully!")
print("Features importance:", dict(zip(features, interview_model.feature_importances_)))