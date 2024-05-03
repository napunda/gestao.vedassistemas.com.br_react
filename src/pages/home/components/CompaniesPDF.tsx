import { Page, Text, Document, StyleSheet, Font } from "@react-pdf/renderer";
import RedHatDisplay from "../../../assets/fonts/RedHatDisplay-Regular.ttf";

import { Companies } from "../interfaces/companies";

Font.register({
  family: "Red Hat Display",
  src: RedHatDisplay,
});
const styles = StyleSheet.create({
  body: {
    padding: 65,
    fontFamily: "Red Hat Display",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    fontFamily: "Red Hat Display",
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
  },

  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
    fontFamily: "Red Hat Display",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
    fontFamily: "Red Hat Display",
  },
});

interface ICompaniesPDFProps {
  companies: Companies[];
}

export const CompaniesPDF = ({ companies }: ICompaniesPDFProps) => {
  return (
    <Document>
      {companies.map((company) => (
        <Page key={company.id}>
          <Text style={styles.title}>{company.name}</Text>
          <Text style={styles.text}>ID: {company.id}</Text>
          <Text style={styles.text}>ID Machine: {company.id_machine}</Text>
          <Text style={styles.text}>ID Machin {company.id_machine}</Text>
          <Text style={styles.text}>Documento {company.document}</Text>
          <Text style={styles.text}>
            Status: {company.access_allowed ? "Ativo" : "Inativo"}
          </Text>
          <Text style={styles.text}>
            Período de teste: {company.test_period_active ? "Sim" : "Não"}
          </Text>
          <Text style={styles.text}>
            Data de início do período de teste:{" "}
            {company.start_test_period_at
              ? new Date(company.start_test_period_at).toLocaleDateString()
              : "N/A"}
          </Text>
          <Text style={styles.text}>Endereço: {company.address}</Text>
          <Text style={styles.text}>Estado: {company.state}</Text>
          <Text style={styles.text}>Cidade: {company.city}</Text>
          <Text style={styles.text}>Complemento: {company.complement}</Text>
          <Text style={styles.text}>Bairro: {company.neighborhood}</Text>
          <Text style={styles.text}>Telefone: {company.phone}</Text>
          <Text style={styles.text}>
            Criado em: {new Date(company.created_at).toLocaleDateString()}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} - ${totalPages}`
            }
            fixed
          />
        </Page>
      ))}
    </Document>
  );
};
