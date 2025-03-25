import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer

class MatchmakingAI:
    def __init__(self, file_path, target_username):  
        self.file_path = file_path 
        self.target_username = target_username
        self.df = self.load_data()
        self.target_user = self.get_target_user()

    def load_data(self):
        """Load data from an Excel file."""
        try:
            print(f"Trying to load file: {self.file_path}")  # Debugging
            df = pd.read_excel(self.file_path, engine="openpyxl")  # ✅ Force openpyxl
            print("Columns in dataset:", df.columns)  # Debugging step
            return df
        except Exception as e:
            print("Error loading data:", e)
            return None

    def get_target_user(self):
        """Fetch the logged-in user's details for matchmaking."""
        target_user = self.df[self.df["Username"] == self.target_username]
        if target_user.empty:
            raise ValueError(f"No data found for user: {self.target_username}")
        return target_user.iloc[0]

    def preprocess_data(self):
        """Combine features for similarity calculation."""
        self.df.fillna("", inplace=True)  # Fix: Ensure no NaN values
        self.df["combined_features"] = (
            self.df["First Name"].astype(str) + " " +
            self.df["Last Name"].astype(str) + " " +
            self.df["What field are you studying?"].astype(str) + " " +
            self.df["What year are you studying in?"].astype(str) + " " +
            self.df["What exam are you preparing for?"].astype(str)
        )

    def find_best_matches(self, top_n=10):
        """Find the top N most similar users."""
        self.preprocess_data()

        user_data = f"{self.target_user['First Name']} {self.target_user['Last Name']} {self.target_user['What field are you studying?']} {self.target_user['What year are you studying in?']} {self.target_user['What exam are you preparing for?']}"

        vectorizer = CountVectorizer().fit_transform(self.df["combined_features"].tolist() + [user_data])
        similarity_matrix = cosine_similarity(vectorizer)

        user_index = len(self.df)
        similarities = list(enumerate(similarity_matrix[user_index][:-1]))

        sorted_matches = sorted(similarities, key=lambda x: x[1], reverse=True)
        best_matches = [self.df.iloc[i[0]].to_dict() for i in sorted_matches[:top_n]]

        return best_matches
