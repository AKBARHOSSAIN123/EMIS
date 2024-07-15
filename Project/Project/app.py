from flask import Flask, render_template, request, redirect, url_for, flash, session
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# In-memory storage for users and exam data
users = {}
exam_data = {
    'module_name': 'Sample Module',
    'num_students': 30,
    'start_time': (datetime.now() + timedelta(minutes=1)).strftime('%Y-%m-%dT%H:%M'),
    'end_time': (datetime.now() + timedelta(hours=2)).strftime('%Y-%m-%dT%H:%M'),
    'allow_leave_times': [15, 30, 45],
    'prohibited_times': [10, 20, 40]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        exam_data['module_name'] = request.form['module_name']
        exam_data['num_students'] = int(request.form['num_students'])
        exam_data['start_time'] = request.form['start_time']
        exam_data['end_time'] = request.form['end_time']
        flash('Exam details updated successfully', 'success')
        return redirect(url_for('admin'))
    return render_template('admin.html', exam_data=exam_data)

@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')

@app.route('/settings', methods=['GET', 'POST'])
def settings():
    if request.method == 'POST':
        flash('Settings updated successfully', 'success')
        return redirect(url_for('settings'))
    return render_template('settings.html')

@app.route('/exam_info')
def exam_info():
    return render_template('exam_info.html', exam_data=exam_data)

@app.route('/issues_log', methods=['GET', 'POST'])
def issues_log():
    if request.method == 'POST':
        issue_description = request.form['issue_description']
        flash(f'Issue logged: {issue_description}', 'info')
        return redirect(url_for('issues_log'))
    return render_template('issues_log.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users:
            flash('Username already exists', 'error')
        else:
            users[username] = password
            flash('Registration successful', 'success')
            return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username] == password:
            session['username'] = username
            flash('Login successful', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials', 'error')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('Logged out successfully', 'info')
    return redirect(url_for('index'))

@app.route('/profile', methods=['GET', 'POST'])
def profile():
    if 'username' not in session:
        flash('You need to login first', 'error')
        return redirect(url_for('login'))
    user_data = {'username': session['username'], 'email': ''}
    if request.method == 'POST':
        flash('Profile updated successfully', 'success')
    return render_template('profile.html', user_data=user_data)

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    app.run(debug=True)
