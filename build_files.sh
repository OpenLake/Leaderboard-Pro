echo "BUILD START"
cd api
pip3 install -r requirements.txt
python3 manage.py collectstatic --noinput --clear
echo "BUILD END"