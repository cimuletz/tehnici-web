DROP TYPE IF EXISTS categ_produs;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categ_produs AS ENUM( 'disponibil', 'comanda', 'limitat');
CREATE TYPE tipuri_produse AS ENUM('constructii', 'finisaje', 'sanitare', 'unelte');
CREATE TYPE unitate_masura as enum('buc', 'kg', 'metru', 'm2');


CREATE TABLE IF NOT EXISTS produse (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL, 
   um unitate_masura default 'buc',
   tip_produs tipuri_produse DEFAULT 'constructii',
   categorie categ_produs DEFAULT 'disponibil',
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT into produse (nume,descriere,pret, um, tip_produs, categorie, imagine) VALUES 
('Țeavă rotundă 48.3 x 2 mm', 'Țeavă de oțel pentru instalații', 11 , 'metru', 'constructii', 'disponibil', 'teava48.jpg'),

('Țeavă rotundă 26.9 x 2 mm', 'Țeavă de oțel pentru instalații', 7.5 , 'metru', 'constructii', 'disponibil', 'teava26.jpg'),

('Țeavă pătrată 40 x 30 x 2 mm', 'Țeavă de oțel, ideală pentru fundații', 13 , 'metru', 'constructii','limitat','teava40.jpg'),

('Tablă neagră 5mm, 1.5 x 2 m', 'Tablă neagră pentru confecții metalice', 320 , 'm2','constructii', 'comanda' ,'tabla.jpg'),

('Oțel beton 10mm', 'Oțel beton pentru construcții', 25 , 'kg', 'constructii', 'disponibil','otelbeton.jpg'),

('Silicon sanitar transparent', 'Silicon rezistent la apă', 19 , 'buc', 'finisaje', 'disponibil', 'silicon.jpg'),

('Adeziv Ceresit CM9', 'Adeziv pentru polistiren expandat', 25.5 , 'buc', 'finisaje', 'limitat', 'ceresitcm9.jpg'),

('Adeziv Ceresit CM11', 'Adeziv pentru gresie și faianță', 23, 'buc','finisaje', 'disponibil',  'ceresitcm11.jpg'),

('Spumă poliuretanică pentru montaj', 'Spumă poliuretanică pentru izolații', 12 , 'buc', 'finisaje', 'comanda', 'spuma.jpg'),

('Adeziv gel poliuretanic', 'Se aplică manual', 17 , 'buc', 'finisaje', 'disponibil', 'adezivgel.jpg'),

('Țeavă PVC canalizare, 50 x 1.8 mm', 'Țeavă PVC cu inel interior', 7 , 'metru', 'sanitare', 'comanda', 'pvc50.jpg'),

('Teavă PVC canalizare, 75  x1.9 mm', 'Țeavă PVC pentru canalizări interioare', 9 , 'metru','sanitare', 'disponibil', 'pvc75.jpg'),

('Robinet trecere filet interior 1/2"', 'Robinet din inox, ideal pentru instalații de apă caldă', 14 , 'buc', 'sanitare', 'limitat', 'robinet12.jpg'),

('Robinet trecere cu bilă, DN20', 'Robinet din PPR cu filet interior', 20.5, 'buc', 'sanitare', 'disponibil', 'robinetppr.jpg'),


('Bază cămin canalizare PVC', 'D110 cu 3 intrări și o ieșire', 350, 'buc','sanitare', 'comanda', 'camin.jpg'),

('Mașină de găurit Bosch', 'Model EasyImpact, cu percuție', 230, 'buc', 'unelte', 'disponibil', 'bormasina.jpg'),


('Polizor unghiular Bosch', 'Model PWS-700, 750W', 190 , 'buc', 'unelte', 'comanda',  'flex.jpg'),


('Fierăstrău circular Panzer',  '1200W, disc de 110mm', 290 , 'buc', 'unelte', 'limitat', 'fierastrau.jpg'),

('Ciocan rotopercutor Panzer', 'Trei funcții, 600W', 180,'buc', 'unelte','disponibil', 'rotopercutor.jpg');

ALTER TABLE public.produse
    ADD COLUMN min_order integer DEFAULT 1;

UPDATE produse
SET min_order = ((id*11)%13)
where true;

ALTER TABLE produse
ADD COLUMN livrare BOOL DEFAULT TRUE;

UPDATE produse
set livrare = BOOL(id%2)
where true;