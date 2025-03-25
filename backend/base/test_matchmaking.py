from base.matchmaking import MatchmakingAI  

file_path = r"D:\Preppal_django\backend\base\random_people_data.xlsx"  # ✅ Use raw string (r"...")

matcher = MatchmakingAI(file_path=file_path, target_username="shruti")  # Pass arguments  
matches = matcher.find_best_matches()  

print(matches)
