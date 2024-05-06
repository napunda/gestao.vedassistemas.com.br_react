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
    fontWeight: "extrabold",
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
  const calculateNotActivityDays = (lastActivityAt: Date | null) => {
    if (lastActivityAt) {
      const today = new Date();
      const lastActivityDate = new Date(lastActivityAt);

      const diffTime = Math.abs(today.getTime() - lastActivityDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return diffDays;
    }
    return 0;
  };
  return (
    <Document>
      {companies.map((company) => (
        <Page key={company.id}>
          <Text style={styles.title}>{company.name}</Text>
          <Text style={styles.text}>ID: {company.id}</Text>
          <Text style={styles.text}>ID Machine: {company.id_machine}</Text>
          <Text style={styles.text}>Documento {company.document}</Text>
          <Text style={styles.text}>
            Dias inativo:{" "}
            {company.last_activity_at
              ? calculateNotActivityDays(company.last_activity_at)
              : 0}
          </Text>
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
          <Text style={styles.text}>
            Dias restantes: {company.remaining_days ?? "N/A"}
          </Text>
          <Text style={styles.text}>Endereço: {company.address ?? "N/A"}</Text>
          <Text style={styles.text}>Estado: {company.state ?? "N/A"}</Text>
          <Text style={styles.text}>Cidade: {company.city ?? "N/A"}</Text>
          <Text style={styles.text}>
            Complemento: {company.complement ?? "N/A"}
          </Text>
          <Text style={styles.text}>
            Bairro: {company.neighborhood ?? "N/A"}
          </Text>
          <Text style={styles.text}>Telefone: {company.phone ?? "N/A"}</Text>
          <Text style={styles.text}>
            Criado em: {new Date(company.created_at).toLocaleDateString()}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
            fixed
          />
        </Page>
      ))}
    </Document>
  );
};
