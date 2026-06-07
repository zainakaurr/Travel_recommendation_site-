### Future Instullation Guide


Install:

```
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
To run the server:

Write the command below in terminal 
```python
uvicorn backend.app.main:app --reload
```
***Note:*** To reload the html run the command above in the terminal, that will run it locally.



## Instrustions to run the project
1. Clone the repository to your loacl machine.
2. Create .env file according to the .env.example to get the API keys, in the project root folder.
3. Run using this command :
```shell 
uvicorn backend.app.main:app --reload
```


